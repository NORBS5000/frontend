import React, { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import type { Asset, LoanFormData } from "../../../types";
import { submitLoanToSupabase } from "../../../api/loanSubmission";
import { analyzeAssets } from "../../../api/assetsApi";
import { analyzeIdDocument } from "../../../api/idAnalyzerApi";
import { submitBankStatement } from "../../../api/bankStatementApi";
import { analyzeCallLogs } from "../../../api/callLogsApi";
import { analyzeMpesaStatement } from "../../../api/mpesaApi";
import DocumentUploader from "../../../components/ui/DocumentUploader";
import GuarantorFields from "../../../components/forms/GuarantorFields";
import ProgressSteps from "../../../components/ui/progressBar";

const InformalLoanRequest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const steps = ["Assets", "Documents", "Loan Details"];
  const [loanId] = useState(() => crypto.randomUUID());

  // Processing states
  const [assetsProcessing, setAssetsProcessing] = useState(false);
  const [documentsProcessing, setDocumentsProcessing] = useState(false);
  const [guarantorsProcessing, setGuarantorsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File states
  const [assets, setAssets] = useState<Asset[]>([]);
  const [homeFloorPhoto, setHomeFloorPhoto] = useState<File[]>([]);
  const [shopPicture, setShopPicture] = useState<File[]>([]);
  const [bankStatements, setBankStatements] = useState<File[]>([]);
  const [mpesaStatements, setMpesaStatements] = useState<File[]>([]);
  const [callLogs, setCallLogs] = useState<File[]>([]);

  // Processing results
  const [assetResults, setAssetResults] = useState<any[]>([]);
  const [documentResults, setDocumentResults] = useState<any>({});
  const [guarantorResults, setGuarantorResults] = useState<any[]>([]);
  const [guarantorFiles, setGuarantorFiles] = useState<File[]>([]);
  const [bankAnalysisResults, setBankAnalysisResults] = useState<any[]>([]);
  const [callLogsAnalysisResults, setCallLogsAnalysisResults] = useState<any[]>([]);
  const [mpesaAnalysisResults, setMpesaAnalysisResults] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoanFormData>({
    defaultValues: {
      sector: "informal",
      hasBankAccount: false,
      hasRetailBusiness: false,
      guarantors: [
        { fullName: "", nationality: "", idNumber: "", contact: "" },
        { fullName: "", nationality: "", idNumber: "", contact: "" },
      ],
    },
  });

  const hasRetailBusiness = watch("hasRetailBusiness");
  const hasBankAccount = watch("hasBankAccount");

  // Step 1: Process Assets
  const processAssets = async () => {
    if (assets.length < 3) {
      alert("Please upload at least 3 asset pictures");
      return;
    }
    if (homeFloorPhoto.length === 0) {
      alert("Please upload a photo of your home");
      return;
    }

    setAssetsProcessing(true);
    try {
      const assetFiles = assets.map(asset => asset.file);
      const results = await analyzeAssets(assetFiles, user?.id, loanId);
      setAssetResults(results);
      
      // Analyze shop image if business exists
      if (hasRetailBusiness && shopPicture.length > 0) {
        console.log('Analyzing shop image...');
        const shopResults = await analyzeAssets([shopPicture[0]], user?.id, loanId);
        console.log('Shop analysis results:', shopResults);
        // Store shop results separately or combine with asset results
        setAssetResults(prev => ({ ...prev, shopAnalysis: shopResults }));
      }
      
      setStep(1);
    } catch (error) {
      alert("Error processing assets. Please try again.");
    } finally {
      setAssetsProcessing(false);
    }
  };

  // Step 2: Process Documents (Bank statements, M-Pesa and Call Logs)
  const processDocuments = async () => {
    if (mpesaStatements.length === 0 && callLogs.length === 0 && bankStatements.length === 0) {
      alert("Please upload at least bank statements, M-Pesa statements, or call logs");
      return;
    }

    setDocumentsProcessing(true);
    try {
      let bankResults: any[] = [];
      
      // Process bank statements if uploaded
      if (bankStatements.length > 0) {
        bankResults = await Promise.all(
          bankStatements.map(file => submitBankStatement(file, user?.id, loanId))
        );
        setBankAnalysisResults(bankResults);
      }
      
      // Process call logs if uploaded
      let callLogsResults: any[] = [];
      if (callLogs.length > 0) {
        callLogsResults = await Promise.all(
          callLogs.map(file => analyzeCallLogs(file, user?.id, loanId))
        );
        setCallLogsAnalysisResults(callLogsResults);
      }
      
      // Process M-Pesa statements if uploaded
      let mpesaResults: any[] = [];
      if (mpesaStatements.length > 0) {
        try {
          const mpesaPassword = watch('mpesaStatementPassword');
          mpesaResults = await Promise.all(
            mpesaStatements.map(file => analyzeMpesaStatement(file, mpesaPassword, user?.id, loanId))
          );
          setMpesaAnalysisResults(mpesaResults);
        } catch (error) {
          console.log('M-Pesa processing failed after 15 seconds, continuing without it');
          mpesaResults = [];
        }
      }
      
      const results = {
        bankStatements: bankResults,
        mpesa: mpesaResults,
        callLogs: callLogsResults
      };
      
      setDocumentResults(results);
      setStep(2);
    } catch (error: any) {
      console.error('Document processing error:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      alert("Error processing documents. Please try again.");
    } finally {
      setDocumentsProcessing(false);
    }
  };

  // Step 3: Process Guarantors
  const processGuarantors = async (files: File[]) => {
    setGuarantorsProcessing(true);
    try {
      const results = await Promise.all(
        files.map(file => analyzeIdDocument(file))
      );
      setGuarantorResults(results);
      setGuarantorFiles(files);
      return results;
    } catch (error) {
      alert("Error processing guarantor IDs. Please try again.");
      return [];
    } finally {
      setGuarantorsProcessing(false);
    }
  };

  const onSubmit: SubmitHandler<LoanFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const formData: LoanFormData = {
        ...data,
        assets,
        homeFloorPhoto: homeFloorPhoto[0],
        shopPicture: hasRetailBusiness ? shopPicture[0] : undefined,
        bankStatements: hasBankAccount ? bankStatements : [],
        bankStatementPassword: hasBankAccount && bankStatements.length > 0 ? data.bankStatementPassword : undefined,
        bankAnalysisResults,
        mpesaStatements,
        mpesaStatementPassword:
          mpesaStatements.length > 0 ? data.mpesaStatementPassword : undefined,
        callLogs,
        callLogsAnalysisResults,
        mpesaStatements,
        mpesaAnalysisResults,
        guarantorFiles,
        assetAnalysisResults: assetResults
      };

      // Submit to Supabase instead of external API
      const response = await submitLoanToSupabase(formData);
      alert("Loan application submitted successfully!");
      navigate(`/`);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting loan application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAssetPreviews = (files: Asset[], setFiles: React.Dispatch<React.SetStateAction<Asset[]>>) => (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {files.map((asset, idx) => (
        <div key={idx} className="relative h-28 w-full rounded-lg overflow-hidden border shadow-sm">
          <img src={URL.createObjectURL(asset.file)} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => setFiles(files.filter((_, i) => i !== idx))}
            className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 hover:bg-red-600"
          >
            ✕
          </button>
          {assetResults[idx] && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1">
              Value: ${assetResults[idx].value.toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderPreviews = (files: File[]) => (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {files.map((file, idx) => (
        <img
          key={idx}
          src={URL.createObjectURL(file)}
          alt="preview"
          className="h-24 w-full object-cover rounded-lg border shadow-sm"
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Informal Sector Loan Application
          </h1>

          <ProgressSteps currentStep={step} steps={steps} />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-10">
            {/* STEP 0: ASSETS */}
            {step === 0 && (
              <>
                <div className="bg-gray-50 rounded-xl border p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    3 or more of your most Valuable Asset Photos
                  </h3>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const newAssets: Asset[] = Array.from(e.target.files).map((file) => ({
                          file,
                          name: file.name,
                        }));
                        setAssets([...assets, ...newAssets]);
                      }
                    }}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                  />
                  {assets.length > 0 && renderAssetPreviews(assets, setAssets)}
                </div>

                <div className="bg-gray-50 rounded-xl border p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Home Verification</h3>
                  <DocumentUploader
                    label="Photo of Your Home"
                    files={homeFloorPhoto}
                    onFilesChange={setHomeFloorPhoto}
                    accept="image/*"
                    required
                  />
                  {homeFloorPhoto.length > 0 && renderPreviews(homeFloorPhoto)}
                </div>

                <div className="bg-gray-50 rounded-xl border p-6 shadow-sm">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("hasRetailBusiness")}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">I own a retail business</span>
                  </label>

                  {hasRetailBusiness && (
                    <div className="mt-4 space-y-4 pl-6 border-l-2 border-blue-100">
                      <input
                        type="text"
                        placeholder="Business Registration Number"
                        {...register("businessRegistrationNumber")}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="Business Location"
                        {...register("businessLocation")}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                      <DocumentUploader
                        label="Shop Picture"
                        files={shopPicture}
                        onFilesChange={setShopPicture}
                        accept="image/*"
                      />
                      {shopPicture.length > 0 && renderPreviews(shopPicture)}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={processAssets}
                    disabled={assetsProcessing}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {assetsProcessing ? "Processing Assets..." : "Continue"}
                  </button>
                </div>
              </>
            )}

            {/* STEP 1: DOCUMENTS */}
            {step === 1 && (
              <>
                <div className="bg-gray-50 rounded-xl border p-6 shadow-sm">
                  <label className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      {...register("hasBankAccount")}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">I have a bank account</span>
                  </label>

                  {hasBankAccount && (
                    <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Bank Statements</h4>
                      <DocumentUploader
                        label="Upload Bank Statements (Last 3 months)"
                        files={bankStatements}
                        onFilesChange={setBankStatements}
                        multiple
                      />
                      {bankStatements.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Statement Password
                          </label>
                          <input
                            type="password"
                            {...register("bankStatementPassword")}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl border p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">M-Pesa Statements</h3>
                  <DocumentUploader
                    label="Upload Statements"
                    files={mpesaStatements}
                    onFilesChange={setMpesaStatements}
                    multiple
                  />
                  {mpesaStatements.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        M-Pesa Statement Password
                      </label>
                      <input
                        type="password"
                        {...register("mpesaStatementPassword")}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl border p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Call Logs</h3>
                  <DocumentUploader
                    label="Upload Call Logs"
                    files={callLogs}
                    onFilesChange={setCallLogs}
                    multiple
                    accept=".csv"
                  />
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="px-6 py-3 border rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={processDocuments}
                    disabled={documentsProcessing}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {documentsProcessing ? "Processing Documents..." : "Continue"}
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: LOAN DETAILS & GUARANTORS */}
            {step === 2 && (
              <>
                <div className="bg-gray-50 rounded-xl border p-6 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount Requested *
                      </label>
                      <input
                        type="number"
                        {...register("amountRequested", {
                          required: "Amount is required",
                          valueAsNumber: true,
                          min: { value: 100, message: "Minimum loan amount is 100" },
                        })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                      {errors.amountRequested && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.amountRequested.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Repayment Date *
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        {...register("repaymentDate", {
                          required: "Repayment date is required",
                          validate: (val) =>
                            new Date(val) > new Date(new Date().toDateString()) ||
                            "Repayment date must be today or in the future",
                        })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                      {errors.repaymentDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.repaymentDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <GuarantorFields 
                    register={register}
                    setValue={setValue}
                    errors={errors} 
                    onProcessComplete={processGuarantors}
                    processing={guarantorsProcessing}
                  />
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || guarantorsProcessing}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default InformalLoanRequest;
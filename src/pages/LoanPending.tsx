import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
}

interface Document {
  name: string;
  status: 'uploaded' | 'missing' | 'pending';
  required: boolean;
}

const LoanPending: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  // Mock timeline data
  const timeline: TimelineStep[] = [
    {
      id: '1',
      title: 'Application Submitted',
      description: 'Your loan application has been received',
      status: 'completed',
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'Document Verification',
      description: 'We are reviewing your submitted documents',
      status: 'current',
    },
    {
      id: '3',
      title: 'Credit Assessment',
      description: 'Evaluating your creditworthiness',
      status: 'pending',
    },
    {
      id: '4',
      title: 'Approval Decision',
      description: 'Final decision on your loan application',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Loan Disbursement',
      description: 'Funds will be transferred to your account',
      status: 'pending',
    },
  ];

  // Mock document checklist
  const documents: Document[] = [
    { name: 'Asset Pictures', status: 'uploaded', required: true },
    { name: 'Home Floor Photo', status: 'uploaded', required: true },
    { name: 'Bank Statements', status: 'uploaded', required: true },
    { name: 'ID Document', status: 'missing', required: true },
    { name: 'Proof of Income', status: 'pending', required: true },
    { name: 'Guarantor Information', status: 'uploaded', required: true },
  ];

  const handleDocumentUpload = (documentName: string) => {
    setSelectedDocument(documentName);
    setShowUploadModal(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedDocument) {
      // Mock upload logic
      console.log(`Uploading ${file.name} for ${selectedDocument}`);
      setShowUploadModal(false);
      setSelectedDocument(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Loan Application Status
            </h1>
            <span className="text-sm text-gray-500">ID: {id}</span>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Application Progress
            </h2>
            <div className="space-y-4">
              {timeline.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : step.status === 'current'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                    {step.date && (
                      <p className="text-xs text-gray-400 mt-1">{step.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Checklist */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Document Checklist
            </h2>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-3 ${
                        doc.status === 'uploaded'
                          ? 'bg-green-500'
                          : doc.status === 'pending'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {doc.name}
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        doc.status === 'uploaded'
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {doc.status === 'uploaded'
                        ? 'Uploaded'
                        : doc.status === 'pending'
                        ? 'Pending'
                        : 'Missing'}
                    </span>
                    {doc.status === 'missing' && (
                      <button
                        onClick={() => handleDocumentUpload(doc.name)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Home
            </button>
            <button
              onClick={() => alert('Edit functionality would be implemented here')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Application
            </button>
            <button
              onClick={() => alert('Withdraw functionality would be implemented here')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Withdraw Application
            </button>
            <button
              onClick={() => alert('Contact support functionality would be implemented here')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Upload {selectedDocument}
            </h3>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPending;
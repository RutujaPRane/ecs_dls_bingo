import React, { useState, useEffect } from 'react';
import { CompletedTask } from '../types';
import { CheckCircle2, XCircle, Clock, Search, Filter, Eye, Image as ImageIcon } from 'lucide-react';

const ModeratorDashboard: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<CompletedTask | null>(null);

  // In a real app, this would come from your backend
  const [submissions, setSubmissions] = useState<CompletedTask[]>([
    {
      taskId: 1,
      userId: 'user1',
      userName: 'John Doe',
      proof: 'Major: Computer Science',
      timestamp: Date.now() - 1000000,
      status: 'pending'
    },
    {
      taskId: 2,
      userId: 'user2',
      userName: 'Jane Smith',
      proof: 'Hometown: Boston, MA',
      timestamp: Date.now() - 2000000,
      status: 'approved'
    }
  ]);

  const handleApprove = (submission: CompletedTask) => {
    setSubmissions(prev => 
      prev.map(s => 
        s.userId === submission.userId && s.taskId === submission.taskId
          ? { ...s, status: 'approved' }
          : s
      )
    );
    setSelectedSubmission(null);
  };

  const handleReject = (submission: CompletedTask) => {
    setSubmissions(prev => 
      prev.map(s => 
        s.userId === submission.userId && s.taskId === submission.taskId
          ? { ...s, status: 'rejected' }
          : s
      )
    );
    setSelectedSubmission(null);
  };

  const getStatusIcon = (status: CompletedTask['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadgeColor = (status: CompletedTask['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  const filteredSubmissions = submissions
    .filter(submission => filter === 'all' || submission.status === filter)
    .filter(submission => 
      submission.userName.toLowerCase().includes(search.toLowerCase()) ||
      submission.proof.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proof
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubmissions.map((submission) => (
              <tr key={`${submission.userId}-${submission.taskId}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(submission.status)}
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{submission.userName}</div>
                  <div className="text-sm text-gray-500">ID: {submission.userId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Task #{submission.taskId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{submission.proof}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(submission.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    {submission.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(submission)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(submission)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Submission Details
                </h3>
                <p className="text-sm text-gray-500">
                  Task #{selectedSubmission.taskId} by {selectedSubmission.userName}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Status</h4>
                <div className="mt-1 flex items-center">
                  {getStatusIcon(selectedSubmission.status)}
                  <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedSubmission.status)}`}>
                    {selectedSubmission.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Proof</h4>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  {selectedSubmission.proof}
                </div>
              </div>

              {selectedSubmission.status === 'pending' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleApprove(selectedSubmission)}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedSubmission)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;
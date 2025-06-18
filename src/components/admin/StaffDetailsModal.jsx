// src/components/admin/StaffDetailsModal.jsx
import { FaTimes, FaUtensils, FaCalendarAlt, FaPhone, FaEnvelope, FaUserShield, FaUserTie } from 'react-icons/fa';

const StaffDetailsModal = ({ isOpen, onClose, staff, responsibilities }) => {
  if (!isOpen || !staff) return null;

  const getRoleIcon = () => {
    switch(staff.role) {
      case 'admin': return <FaUserShield className="text-purple-500 text-4xl" />;
      case 'manager': return <FaUserTie className="text-blue-500 text-4xl" />;
      case 'chef': return <FaUtensils className="text-red-500 text-4xl" />;
      default: return <div className="w-10 h-10 bg-gray-200 rounded-full"></div>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">Staff Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {getRoleIcon()}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{staff.name}</h3>
            <div className="text-lg text-gray-600 capitalize">{staff.role}</div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <FaEnvelope className="text-gray-400 mt-1 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-gray-800">{staff.email}</div>
              </div>
            </div>

            {staff.phone && (
              <div className="flex items-start">
                <FaPhone className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="text-gray-800">{staff.phone}</div>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <FaCalendarAlt className="text-gray-400 mt-1 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Joined On</div>
                <div className="text-gray-800">{formatDate(staff.createdAt)}</div>
              </div>
            </div>
          </div>

          {responsibilities && responsibilities.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Responsibilities</h4>
              <ul className="space-y-2">
                {responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailsModal;
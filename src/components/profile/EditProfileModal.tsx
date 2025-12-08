import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types/profile.types';
import { 
  fetchColleges, 
  getUniqueStates, 
  getDistrictsByState,
  filterByStateAndDistrict,
  searchCollegesByName,
  type College 
} from '../../utils/collegeUtils';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updates: ProfileUpdateData) => Promise<void>;
}

export interface ProfileUpdateData {
  name: string;
  state: string;
  district: string;
  university: string;
  stream: string;
  avatar?: File | string;
}

interface ValidationErrors {
  name?: string;
  state?: string;
  district?: string;
  university?: string;
  stream?: string;
  avatar?: string;
}

export default function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
  // College data state
  const [colleges, setColleges] = useState<College[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [collegesLoading, setCollegesLoading] = useState(true);
  
  const [formData, setFormData] = useState<ProfileUpdateData>({
    name: user.name,
    state: (user as any).prefs?.state || '',
    district: (user as any).prefs?.district || '',
    university: user.university,
    stream: user.stream || '',
    avatar: user.avatar,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load colleges data on mount
  useEffect(() => {
    const loadColleges = async () => {
      setCollegesLoading(true);
      const data = await fetchColleges();
      setColleges(data);
      const uniqueStates = getUniqueStates(data);
      setStates(uniqueStates);
      setCollegesLoading(false);
    };
    loadColleges();
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (formData.state && colleges.length > 0) {
      const stateDistricts = getDistrictsByState(colleges, formData.state);
      setDistricts(stateDistricts);
    } else {
      setDistricts([]);
    }
  }, [formData.state, colleges]);

  // Update filtered colleges when state or district changes
  useEffect(() => {
    if (formData.state && formData.district && colleges.length > 0) {
      const filtered = filterByStateAndDistrict(
        colleges,
        formData.state,
        formData.district
      );
      setFilteredColleges(filtered);
    } else {
      setFilteredColleges([]);
    }
  }, [formData.state, formData.district, colleges]);

  // Filter colleges based on search term
  const handleUniversitySearch = (value: string) => {
    setFormData(prev => ({ ...prev, university: value }));
    
    if (value.length > 0 && formData.state && formData.district) {
      const baseFiltered = filterByStateAndDistrict(
        colleges,
        formData.state,
        formData.district
      );
      const searched = searchCollegesByName(baseFiltered, value);
      setFilteredColleges(searched);
      setShowCollegeDropdown(true);
    } else if (formData.state && formData.district) {
      const filtered = filterByStateAndDistrict(
        colleges,
        formData.state,
        formData.district
      );
      setFilteredColleges(filtered);
      setShowCollegeDropdown(value.length > 0);
    } else {
      setShowCollegeDropdown(false);
    }
  };

  // Select college from dropdown
  const selectCollege = (collegeName: string) => {
    setFormData(prev => ({ ...prev, university: collegeName }));
    setShowCollegeDropdown(false);
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 200) {
      newErrors.name = 'Name must be 200 characters or less';
    }

    // Validate state
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    // Validate district
    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }

    // Validate university
    if (!formData.university.trim()) {
      newErrors.university = 'University is required';
    } else if (formData.university.length > 200) {
      newErrors.university = 'University name must be 200 characters or less';
    }

    // Validate stream (optional but has max length)
    if (formData.stream && formData.stream.length > 200) {
      newErrors.stream = 'Stream must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploadError('');
    setFormData({ ...formData, avatar: file });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      setUploadError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setErrors({});
      setUploadError('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Profile
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSaving}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-6 space-y-5">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-green-500 p-[3px] shadow-lg">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-green-600 bg-clip-text text-transparent">
                              {formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Max 5MB, Image files only
                    </p>
                    {uploadError && (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm mt-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>

                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.name
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-colors`}
                      placeholder="Enter your full name"
                      maxLength={200}
                      disabled={isSaving}
                    />
                    {errors.name && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* State Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          state: e.target.value,
                          district: '',
                          university: ''
                        });
                      }}
                      disabled={collegesLoading || isSaving}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.state
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-colors`}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>

                  {/* District Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          district: e.target.value,
                          university: ''
                        });
                      }}
                      disabled={!formData.state || collegesLoading || isSaving}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.district
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-colors`}
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.district}</p>
                    )}
                  </div>

                  {/* University Field with Autocomplete */}
                  <div style={{ position: 'relative' }}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      University <span className="text-red-500">*</span>
                      {formData.state && formData.district && filteredColleges.length > 0 && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                          ({filteredColleges.length} colleges found)
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => handleUniversitySearch(e.target.value)}
                      onFocus={() => {
                        if (formData.state && formData.district && filteredColleges.length > 0) {
                          setShowCollegeDropdown(true);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowCollegeDropdown(false), 200);
                      }}
                      disabled={!formData.state || !formData.district || isSaving}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.university
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-colors`}
                      placeholder={
                        !formData.state 
                          ? "Select state first" 
                          : !formData.district 
                          ? "Select district first" 
                          : "Search or type your university"
                      }
                      maxLength={200}
                      autoComplete="off"
                    />
                    {errors.university && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.university}</p>
                    )}
                    
                    {/* College Dropdown */}
                    {showCollegeDropdown && filteredColleges.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        marginTop: '4px',
                        zIndex: 1000,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      className="dark:bg-gray-800 dark:border-gray-600"
                      >
                        {filteredColleges.slice(0, 50).map((college, index) => (
                          <div
                            key={index}
                            onMouseDown={() => selectCollege(college.name)}
                            style={{
                              padding: '10px 12px',
                              cursor: 'pointer',
                              borderBottom: index < filteredColleges.length - 1 ? '1px solid #eee' : 'none',
                              transition: 'background-color 0.2s'
                            }}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {college.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {college.type} • {college.district}
                            </div>
                          </div>
                        ))}
                        {filteredColleges.length > 50 && (
                          <div className="p-2 text-xs text-gray-500 dark:text-gray-400 text-center italic">
                            Showing first 50 results. Type to narrow down...
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stream/Major Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stream/Major
                    </label>
                    <input
                      type="text"
                      value={formData.stream}
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.stream
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-colors`}
                      placeholder="e.g., Computer Science"
                      maxLength={200}
                      disabled={isSaving}
                    />
                    {errors.stream && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.stream}</p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

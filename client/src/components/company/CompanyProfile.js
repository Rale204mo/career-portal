import React, { useState, useEffect } from 'react';

const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    industry: '',
    size: '',
    website: '',
    description: '',
    contactEmail: '',
    phone: '',
    address: '',
    foundedYear: '',
    logo: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    benefits: '',
    culture: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    // Mock data - replace with API call
    setProfile({
      companyName: 'Tech Innovations Inc.',
      industry: 'Information Technology',
      size: '100-500',
      website: 'https://techinnovations.com',
      description: 'Leading technology company specializing in innovative solutions.',
      contactEmail: 'hr@techinnovations.com',
      phone: '+1-555-0123',
      address: '123 Tech Street, Silicon Valley, CA',
      foundedYear: '2015',
      logo: '',
      linkedin: 'https://linkedin.com/company/techinnovations',
      twitter: 'https://twitter.com/techinnovations',
      facebook: 'https://facebook.com/techinnovations',
      benefits: 'Health insurance, 401k matching, flexible work hours, professional development budget',
      culture: 'We foster innovation, collaboration, and work-life balance. Our team values diversity and continuous learning.'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call to update profile
      console.log('Updating profile:', profile);
      // await updateCompanyProfile(profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to a server and get back a URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({
          ...profile,
          logo: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Logo Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Company Logo</h2>
            <div className="flex items-center space-x-4">
              {profile.logo ? (
                <img
                  src={profile.logo}
                  alt="Company Logo"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Logo</span>
                </div>
              )}
              {isEditing && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer"
                  >
                    Upload Logo
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                  value={profile.companyName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  name="industry"
                  required
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                  value={profile.industry}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Size</label>
                <select
                  name="size"
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                  value={profile.size}
                  onChange={handleChange}
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Founded Year</label>
                <input
                  type="number"
                  name="foundedYear"
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                  value={profile.foundedYear}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                  value={profile.contactEmail}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                name="website"
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                value={profile.website}
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                rows="3"
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                value={profile.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                  value={profile.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter</label>
                <input
                  type="url"
                  name="twitter"
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                  value={profile.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/yourcompany"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Facebook</label>
              <input
                type="url"
                name="facebook"
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                value={profile.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/yourcompany"
              />
            </div>
          </div>

          {/* Company Description */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Company Description</h2>
            <textarea
              name="description"
              rows="4"
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
              value={profile.description}
              onChange={handleChange}
              placeholder="Describe your company culture, mission, and values..."
            />
          </div>

          {/* Company Benefits */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Employee Benefits</h2>
            <textarea
              name="benefits"
              rows="3"
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
              value={profile.benefits}
              onChange={handleChange}
              placeholder="List the benefits offered to employees..."
            />
          </div>

          {/* Company Culture */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Company Culture</h2>
            <textarea
              name="culture"
              rows="3"
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
              value={profile.culture}
              onChange={handleChange}
              placeholder="Describe your company culture and work environment..."
            />
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;

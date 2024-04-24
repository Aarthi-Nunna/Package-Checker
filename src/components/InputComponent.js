import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InputComponent.css';
import PackageCard from './PackageCard';

function InputComponent() {
  const [language, setLanguage] = useState('');
  const [packageName, setPackageName] = useState('');
  const [response, setResponse] = useState('');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handlePackageNameChange = (event) => {
    setPackageName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/packageInfo?packageName=${encodeURIComponent(packageName)}`);
      const responseData = await response.json();

      const mostRecentRelease = Object.keys(responseData.releases).reduce((a, b) => {
        return a > b ? a : b;
      });

      // Get the upload_time of the most recent release
      const mostRecentUploadTime = responseData.releases[mostRecentRelease][0].upload_time;


      //Extract required information and store in a dictionary
      const packageInfo = {
        "author_name": responseData.info.author,
        "author_email": responseData.info.author_email,
        "description": responseData.info.summary,
        "vulnerabilities": responseData.vulnerabilities,
        "upload_time" : mostRecentUploadTime,
        "last_months_download" : responseData.data.last_month
      };

      setResponse(packageInfo);
    } catch (error) {
      console.error('Error fetching package info:', error);
      const packageInfo = {
        "author_name": "-",
        "author_email": "-",
        "description": "-",
        "vulnerabilities": "",
        "upload_time" : "-",
        "last_months_download" : "-"
      };
      setResponse(packageInfo);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-heading">Package Details</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="language" className="form-label">Language:</label>
          <select id="language" className="form-select" value={language} onChange={handleLanguageChange}>
            <option value="">Select a language</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            {/* Add more options for other languages if needed */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">Package Name:</label>
          <input
            type="text"
            id="packageName"
            className="form-input"
            value={packageName}
            onChange={handlePackageNameChange}
            placeholder="Enter package name..."
          />
        </div>
        <button type="submit" className="form-button">Get Package Info</button>
      </form>
      <div className="response-container">
        {response && (
          <div className="response">
            <h2>Response:</h2>
            <PackageCard
            authorName={response.author_name}
            authorEmail={response.author_email}
            description={response.description}
            vulnerabilities={response.vulnerabilities}
            uploadTime={response.upload_time}
            lastMonthsDownload={response.last_months_download}
          />
          </div>
        )}
      </div>
    </div>
  );
}

export default InputComponent;

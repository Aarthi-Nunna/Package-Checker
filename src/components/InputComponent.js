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
    setResponse('');
  };

  const handlePackageNameChange = (event) => {
    setPackageName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let apiUrl = '';
    if (language === 'Ruby') {
      apiUrl = 'http://localhost:5000/api/packageInfoRuby';
    } else if (language === 'Python') {
      apiUrl = 'http://localhost:5000/api/packageInfoPython';
    } else if (language === 'NodeJS'){
      apiUrl = 'http://localhost:5000/api/packageInfoNode';
    } else if (language === 'Rust'){
      apiUrl = 'http://localhost:5000/api/packageInfoRust';
    }
    // Add more conditions for other languages if needed

    try {
      const response = await fetch(`${apiUrl}?packageName=${encodeURIComponent(packageName)}`);
      const responseData = await response.json();
      console.log(responseData);

      let packageInfo = '';
      if (language === 'Python'){
        const mostRecentRelease = Object.keys(responseData.releases).reduce((a, b) => {
          return a > b ? a : b;
        });

        // Get the upload_time of the most recent release
        const mostRecentUploadTime = responseData.releases[mostRecentRelease][0].upload_time;
         packageInfo = {
          "author_name": responseData.info.author,
          "author_email": responseData.info.author_email,
          "description": responseData.info.summary,
          "vulnerabilities": responseData.vulnerabilities,
          "upload_time" : mostRecentUploadTime,
          "downloads" : responseData.data.last_month
        };
      }

      else if(language === 'Ruby'){

         packageInfo = {
          "author_name" : responseData.authors,
          "author_email" : "-",
          "description" : responseData.info,
          "vulnerabilities" : [],
          "upload_time" : responseData.version_created_at,
          "downloads" : responseData.version_downloads
        }
      }

      else if(language === 'NodeJS'){
        let author_name = "-";

        if (responseData.hasOwnProperty("author"))
          author_name = responseData.author.name;

        packageInfo = {
         "author_name" : author_name,
         "author_email" :"-",
         "description" : responseData.description,
         "vulnerabilities" : [],
         "upload_time" : "-",
         "downloads" : responseData.downloads
       }
      }

      else if(language === 'Rust'){
        console.log(responseData.versions[0]);
        let data = responseData.versions[0];
        packageInfo = {
         "author_name" : data.published_by.name,
         "author_email" :"-",
         "description" : responseData.crate.description,
         "vulnerabilities" : [],
         "upload_time" : data.created_at,
         "downloads" : data.downloads
       }
      }


      setResponse(packageInfo);
    } catch (error) {
      console.error('Error fetching package info:', error);
      const packageInfo = {
        "author_name": "-",
        "author_email": "-",
        "description": "-",
        "vulnerabilities": [],
        "upload_time" : "-",
        "downloads" : "-"
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
            <option value="Ruby">Ruby</option>
            <option value="Python">Python</option>
            <option value="NodeJS">NodeJS</option>
            <option value="Rust">Rust</option>
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
              downloads={response.downloads}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default InputComponent;

import React from 'react';
import Card from 'react-bootstrap/Card';


const PackageCard = ({ authorName, authorEmail, description, vulnerabilities, uploadTime, downloads }) => {
  return (
    <Card style={{ width: '25rem', backgroundColor: '#addfff'}}>
      <Card.Body>
      <div className="card-body">
        <p className="card-text"><strong>Author Name / Publisher:</strong> {authorName}</p>
        <p className="card-text"><strong>Author Email:</strong> {authorEmail}</p>
        <p className="card-text"><strong>Description:</strong> {description}</p>
        <p className="card-text"><strong>Vulnerabilities:</strong> {vulnerabilities.length !== 0 ? vulnerabilities.length : "-"}</p>
        <p className="card-text"><strong>Time of Upload:</strong> {uploadTime}</p>
        <p className="card-text"><strong>Number of Downloads:</strong> {downloads}</p>
      </div>
      </Card.Body>
    </Card>

  );
};

export default PackageCard;

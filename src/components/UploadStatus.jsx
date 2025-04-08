const UploadStatus = ({ isSuccess, message }) => {
    return (
        <div className="upload-status">
            <div className="status-icon">
                {isSuccess ? (
                    <svg className="success-icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                ) : (
                    <div className="loading-spinner"></div>
                )}
            </div>
            <div className="status-message">
                {message || (isSuccess ? "Upload Successful" : "Uploading Video...")}
            </div>
        </div>
    );
};

export default UploadStatus;

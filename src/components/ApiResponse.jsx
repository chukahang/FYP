const ApiResponse = ({ response }) => {
    return (
        <div className="api-response">
            <h3>Uploading Video</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
    );
};

export default ApiResponse;

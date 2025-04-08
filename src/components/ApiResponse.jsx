const ApiResponse = ({ response }) => {
    return (
        <div className="component-wrapper">
            <div className="api-response">
                <h3>Uploading Video</h3>
                <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
        </div>
    );
};

export default ApiResponse;

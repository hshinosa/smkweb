const React = require('react');
    
module.exports = function Test() {
    return (
        <div>
            {true && (
                <div>Test</div>
            )}
        </div>
    );
};

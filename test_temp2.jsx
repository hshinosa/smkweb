const React = require('react');

module.exports = function Test() {
    const [activeTab, setActiveTab] = React.useState('primary');
    const [showDropdown, setShowDropdown] = React.useState(false);
    
    return (
        <div>
            {activeTab === 'primary' && (
                <div className="bg-white">
                    <div className="p-6">
                        <div className="relative">
                            <input type="text" />
                            {showDropdown && (
                                <div className="absolute">
                                    {true ? (
                                        <div>Loading...</div>
                                    ) : true ? (
                                        <div className="py-1">
                                            {[1, 2].map((item) => (
                                                <div key={item}>Item {item}</div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>No items</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <p>Description</p>
                    </div>
                </div>
            )}
        </div>
    );
};

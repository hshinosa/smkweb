                                </button>
                                {showModelDropdown && (
                                    <div className="absolute z-[100] left-0 right-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto">
                                        {loadingModels ? (
                                            <div className="p-4 text-sm text-gray-500">Loading models...</div>
                                        ) : availableModels.length > 0 ? (
                                            <div className="py-1">
                                                {availableModels.map((model) => (
                                                    <button
                                                        key={model.id}
                                                        type="button"
                                                        onClick={() => handleModelSelect(model.id)}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center justify-between border-b border-gray-100 last:border-b-0"
                                                    >
                                                        <span>{model.id}</span>
                                                        {model.owned_by && (
                                                            <span className="text-xs text-gray-400 capitalize">{model.owned_by}</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-sm text-gray-500">No models available. Configure Base URL and API Key first.</div>
                                        )}
                                    </div>
                                )}
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Pilih model dari daftar atau ketik manual. Available dari OpenAI API dan Ollama.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="ai_max_tokens" value="Max Tokens" />
                                    <TextInput
                                        id="ai_max_tokens"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={getSetting('ai_max_tokens')}
                                        onChange={(e) => handleChange('ai_max_tokens', e.target.value)}
                                        placeholder="300"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="ai_temperature" value="Temperature (0-1)" />
                                    <TextInput
                                        id="ai_temperature"
                                        type="number"
                                        step="0.1"
                                        className="mt-1 block w-full"
                                        value={getSetting('ai_temperature')}
                                        onChange={(e) => handleChange('ai_temperature', e.target.value)}
                                        placeholder="0.3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}


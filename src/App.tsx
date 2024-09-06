import React, { useState } from 'react';
import SelectComponent from './Components/SelectComponent';
import SearchComponent from './Components/SearchComponent';
import SearchAvatarComponent from './Components/SearchAvatarComponent';
import SelectComponentAvatar from './Components/SelectComponentAvatar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FiUser } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import './css/Component.css';

// const getUserImage = (userId: number): string => {
//     return `https://robohash.org/${userId}?set=set5`;
// };

const queryClient = new QueryClient();
const App: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <h1></h1>
                <div style={{
                    display: "flex",
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: "2rem",
                    flexWrap: 'wrap',
                }}>
                    <SelectComponent
                        sort={true}
                        icon=""
                        selectedIcon={<FiCheck />}
                        disabledOptions={[1, 2, 3]}
                        renderOption={(option) => (
                            <div>
                                <strong>{option.title}</strong> <span>@user{option.id}</span>
                            </div>
                        )}
                        multiSelect={true}
                    />
                    <SelectComponent
                        sort={true}
                        icon={<FiUser />}
                        selectedIcon={<FiCheck />}
                        disabledOptions={[]}
                        renderOption={(option) => (
                            <div>
                                <strong>{option.title}</strong> <span>@user{option.id}</span>
                            </div>
                        )}
                        multiSelect={true}

                    />
                    <SelectComponentAvatar
                        sort={true}
                        icon={<FiUser />}
                        selectedIcon={<FiCheck />}
                        disabledOptions={[]}
                        renderOption={(option) => (
                            <div>
                                <strong>{option?.title}</strong> <span>@user{option?.id}</span>
                            </div>
                        )}
                        multiSelect={false}
                    />
                    <SelectComponent
                        sort={true}
                        icon={<GoDotFill style={{ color: "green" }} />}
                        selectedIcon={<FiCheck />}
                        disabledOptions={[]}
                        renderOption={(option) => (
                            <div>
                                <strong>{option.title}</strong> <span>@user{option.id}</span>
                            </div>
                        )}
                        multiSelect={true}
                    />
                    <SearchComponent
                        filter={searchTerm}
                        sort={true}
                        selectedIcon={<FiCheck />}
                        disabledOptions={[]}
                        renderOption={(option) => (
                            <div>
                                <strong>{option.title}</strong> <span>@user{option.id}</span>
                            </div>
                        )}
                        multiSelect={false}
                    />
                    <SearchAvatarComponent
                        filter={searchTerm}
                        sort={true}
                        selectedIcon={<FiCheck />}
                        disabledOptions={[]}
                        renderOption={(option) => (
                            <div>
                                <strong>{option.title}</strong> <span>@user{option.id}</span>
                            </div>
                        )}
                        multiSelect={true}
                    />
                </div>
            </div>
        </QueryClientProvider>
    );
};

export default App;

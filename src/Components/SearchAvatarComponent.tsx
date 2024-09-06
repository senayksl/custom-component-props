import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import '../css/Component.css';
import { FiSearch, FiX } from "react-icons/fi";
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import {FaChevronDown} from "react-icons/fa6";

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

interface SelectComponentProps {
    filter?: string;
    sort?: boolean;
    icon?: React.ReactNode;
    selectedIcon?: React.ReactNode;
    disabledOptions?: number[];
    renderOption?: (option: Post) => React.ReactNode;
    multiSelect?: boolean;
}

const fetchPosts = async (): Promise<Post[]> => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return data;
};

const getUserImage = (userId: number): string => {
    return `https://robohash.org/${userId}?set=set5`;
};

const SearchAvatarComponent: React.FC<SelectComponentProps> = ({
                                                                   filter = '',
                                                                   sort = false,
                                                                   icon,
                                                                   selectedIcon = '✓',
                                                                   disabledOptions = [],
                                                                   renderOption,
                                                                   multiSelect = false,
                                                               }) => {
    const { data: options = [], isLoading, error } = useQuery<Post[]>({
        queryKey: ['posts'],
        queryFn: fetchPosts
    });
    const [selectedOptions, setSelectedOptions] = useState<Post[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    let filteredOptions: Post[] = options || [];

    if (searchTerm) {
        filteredOptions = filteredOptions.filter(option =>
            option.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (sort) {
        filteredOptions = filteredOptions.sort((a, b) => a.title.localeCompare(b.title));
    }

    const handleSelect = (option: Post) => {
        if (multiSelect) {
            setSelectedOptions(prev =>
                prev.some(selected => selected.id === option.id)
                    ? prev.filter(selected => selected.id !== option.id)
                    : [...prev, option]
            );
        } else {
            setSelectedOptions([option]);
            setSearchTerm('');
            setIsOpen(false);
        }
    };

    const handleDeleteChip = (id: number) => {
        setSelectedOptions(prev => prev.filter(option => option.id !== id));
    };

    return (
        <div className="select-component" ref={componentRef}>
            <p style={{fontSize:"14px"}}>Team Member</p>

            <div className={`select-box ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="select-box-content-search-avatar">
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map(option => (
                            <Chip
                                sx={{
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                    color: '#475467',
                                    border: '1px solid #ddd',

                                    '& .MuiChip-deleteIcon': {
                                        color: 'black',
                                        backgroundColor: 'transparent',
                                        borderRadius: 'transparent',
                                    },
                                }}
                                deleteIcon={<FiX style={{ color: '#98A2B3',fontSize:"14px" }} />}
                                key={option.id}
                                avatar={<Avatar src={getUserImage(option.userId)} />}
                                label={option.title}
                                onDelete={() => handleDeleteChip(option.id)}
                                style={{ marginRight: 4 }}
                            />
                        ))
                    ) : (
                        <span className="icon">
                            <FiSearch style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", width: "20px", height: "20px" }} />
                        </span>
                    )}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        placeholder="Search"
                        onClick={() => setIsOpen(true)}
                        className="select-box-input"
                        style={{ marginLeft: "0.8vh" }}
                    />
                </div>
                <span style={{color:"#667085"}}><FaChevronDown style={{color:"#667085"}}/></span>
            </div>
            {isOpen && (
                <div className={`select-options ${isOpen ? 'show' : ''}`}>
                    {filteredOptions.map(option => (
                        <div
                            key={option.id}
                            className={`select-option ${selectedOptions.some(selected => selected.id === option.id) ? 'selected' : ''} ${disabledOptions.includes(option.id) ? 'disabled' : ''}`}
                            onClick={() => !disabledOptions.includes(option.id) && handleSelect(option)}
                        >
                            <img src={getUserImage(option.userId)} alt="icon" style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }} />
                            <span>{renderOption ? renderOption(option) : option.title}</span>
                            {selectedOptions.some(selected => selected.id === option.id) && <span className="check-icon">{selectedIcon}</span>}
                        </div>
                    ))}
                </div>
            )}
            <p style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                This is a hint text to help user.</p>
        </div>
    );
};

export default SearchAvatarComponent;

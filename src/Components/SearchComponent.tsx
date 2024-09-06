import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import '../css/Component.css';
import { FiSearch } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa6";

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

const SearchComponent: React.FC<SelectComponentProps> = ({
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
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
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

    const handleSelect = (id: number) => {
        if (multiSelect) {
            setSelectedOptions(prev =>
                prev.includes(id) ? prev.filter(optionId => optionId !== id) : [...prev, id]
            );
        } else {
            setSelectedOptions([id]);
            setSearchTerm('');
            setIsOpen(false);
        }
    };

    const selectedTitles = options
        .filter(option => selectedOptions.includes(option.id))
        .map(option => option.title)
        .join(', ');

    return (
        <div className="select-component" ref={componentRef}>
            <p style={{fontSize:"14px"}}>Team Member</p>
            <div className={`select-box ${isOpen ? 'active' : ''}`}>
                <div className="select-box-content">
                    <span className="icon">
                        <FiSearch style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", width: "20px", height: "20px" }} />
                    </span>
                    <input
                        type="text"
                        value={searchTerm || selectedTitles}
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
                            className={`select-option ${selectedOptions.includes(option.id) ? 'selected' : ''} ${disabledOptions.includes(option.id) ? 'disabled' : ''}`}
                            onClick={() => !disabledOptions.includes(option.id) && handleSelect(option.id)}
                        >
                            {icon && <span className="icon">{icon}</span>}
                            <span>{renderOption ? renderOption(option) : option.title}</span>
                            {selectedOptions.includes(option.id) && <span className="check-icon">{selectedIcon}</span>}
                        </div>
                    ))}

                </div>

            )}
            <p style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                This is a hint text to help user.</p>
        </div>
    );
};

export default SearchComponent;

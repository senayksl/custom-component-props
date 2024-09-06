import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import '../css/Component.css';
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

const SelectComponent: React.FC<SelectComponentProps> = ({
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
    const [selectedIconImage, setSelectedIconImage] = useState<React.ReactNode>(icon);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (selectedOptions.length > 0) {
            const selectedOption = options.find(option => option.id === selectedOptions[0]);
            if (selectedOption) {
                setSelectedIconImage(<img src={getUserImage(selectedOption.userId)} alt="icon" style={{ width: 24, height: 24, borderRadius: '50%' }} />);
            }
        }
    }, [selectedOptions, options]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    let filteredOptions: Post[] = options || [];

    if (filter) {
        filteredOptions = filteredOptions.filter(option => option.title.toLowerCase().includes(filter.toLowerCase()));
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
            setIsOpen(false);
        }
    };

    const selectedOption = options.find(option => selectedOptions.includes(option.id));

    return (
        <div className="select-component">
            <p style={{fontSize:"14px"}}>Team Member</p>
            <div
                className={`select-box-avatar ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(prev => !prev)}
            >
                <div className="select-box-content-avatar">
                    {selectedIconImage}
                    <span style={{marginLeft:"0.8vh"}}>{selectedOption ? selectedOption.title : "Select a team member"}</span>
                </div>
                <span style={{color:"#667085"}}><FaChevronDown style={{color:"#667085"}}/></span>
            </div>
            <div className={`select-options ${isOpen ? 'show' : ''}`}>
                {filteredOptions.map(option => (
                    <div
                        key={option.id}
                        className={`select-option ${selectedOptions.includes(option.id) ? 'selected' : ''} ${disabledOptions.includes(option.id) ? 'disabled' : ''}`}
                        onClick={() => !disabledOptions.includes(option.id) && handleSelect(option.id)}
                    >
                        <img src={getUserImage(option.userId)} alt="icon" style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }} />
                        <span>{renderOption ? renderOption(option) : option.title}</span>
                        {selectedOptions.includes(option.id) && <span className="check-icon">{selectedIcon}</span>}
                    </div>
                ))}
            </div>
            <p style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                This is a hint text to help user.</p>
        </div>
    );
};

export default SelectComponent;

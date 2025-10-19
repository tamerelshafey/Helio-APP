import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { mockProperties } from '../data/mock-data';
import type { Property, PropertiesContextType, SortConfig } from '../types';

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export const PropertiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortConfig, setSortConfig] = useState<SortConfig<Property>>(null);

    useEffect(() => {
        // Simulate data fetching
        const timer = setTimeout(() => {
            setProperties(mockProperties);
            setLoading(false);
        }, 1500); // 1.5 second delay

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    const handleSortProperties = useCallback((key: keyof Property) => {
        setSortConfig(prevConfig => {
            if (prevConfig && prevConfig.key === key) {
                if (prevConfig.direction === 'descending') {
                    return null; // Go back to default order
                }
                return { ...prevConfig, direction: 'descending' };
            }
            return { key, direction: 'ascending' };
        });
    }, []);


    const handleSaveProperty = useCallback((property: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => {
        const isNew = !property.id;
        setProperties(prevProperties => {
            if (property.id) {
                const existingProperty = prevProperties.find(p => p.id === property.id);
                if (!existingProperty) return prevProperties;
                return prevProperties.map(p => p.id === property.id ? { ...existingProperty, ...property } : p);
            } else {
                const newProperty: Property = {
                    id: Math.max(...prevProperties.map(p => p.id), 0) + 1,
                    ...property,
                    views: 0,
                    creationDate: new Date().toISOString().split('T')[0],
                };
                return [newProperty, ...prevProperties];
            }
        });
        const action = isNew ? 'إنشاء عقار جديد' : 'تعديل عقار';
        logActivity(action, `حفظ العقار: "${property.title}"`);
    }, [logActivity]);

    const handleDeleteProperty = useCallback((id: number) => {
        const propTitle = properties.find(p => p.id === id)?.title || `ID: ${id}`;
        setProperties(prevProperties => prevProperties.filter(p => p.id !== id));
        logActivity('حذف عقار', `حذف العقار: "${propTitle}"`);
    }, [properties, logActivity]);

    const value = useMemo(() => ({
        properties,
        loading,
        sortConfig,
        handleSortProperties,
        handleSaveProperty,
        handleDeleteProperty,
    }), [properties, loading, sortConfig, handleSortProperties, handleSaveProperty, handleDeleteProperty]);

    return (
        <PropertiesContext.Provider value={value}>
            {children}
        </PropertiesContext.Provider>
    );
};

export const usePropertiesContext = (): PropertiesContextType => {
    const context = useContext(PropertiesContext);
    if (context === undefined) {
        throw new Error('usePropertiesContext must be used within a PropertiesProvider');
    }
    return context;
};

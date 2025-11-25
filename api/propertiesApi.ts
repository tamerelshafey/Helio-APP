import { mockProperties } from '../data/mock-data';
import type { Property } from '../types';

// Simulate a database/API backend with mutable data
let properties: Property[] = JSON.parse(JSON.stringify(mockProperties));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getProperties = async (): Promise<Property[]> => {
    await delay(500);
    return JSON.parse(JSON.stringify(properties));
};

export const saveProperty = async (propertyData: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }): Promise<Property> => {
    await delay(600);
    const isNew = !propertyData.id;
    if (isNew) {
        const newProperty: Property = {
            id: Math.max(...properties.map(p => p.id), 0) + 1,
            ...propertyData,
            views: 0,
            creationDate: new Date().toISOString().split('T')[0],
        };
        properties.unshift(newProperty);
        return newProperty;
    } else {
        let updatedProperty: Property | undefined;
        properties = properties.map(p => {
            if (p.id === propertyData.id) {
                const existingProperty = properties.find(prop => prop.id === propertyData.id);
                updatedProperty = { ...existingProperty!, ...propertyData, id: p.id };
                return updatedProperty;
            }
            return p;
        });
        if (!updatedProperty) throw new Error("Property not found");
        return updatedProperty;
    }
};

export const deleteProperty = async (id: number): Promise<{ id: number }> => {
    await delay(500);
    properties = properties.filter(p => p.id !== id);
    return { id };
};
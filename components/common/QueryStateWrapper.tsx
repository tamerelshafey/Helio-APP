import React from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import Spinner from './Spinner';
import ErrorState from './ErrorState';

type QueryResult = Pick<UseQueryResult, 'isLoading' | 'isError' | 'error' | 'refetch'>;

interface QueryStateWrapperProps {
    queries: QueryResult | QueryResult[];
    loader?: React.ReactNode; // Optional custom loader/skeleton
    children: React.ReactNode;
}

const QueryStateWrapper: React.FC<QueryStateWrapperProps> = ({ queries, loader = <Spinner />, children }) => {
    const queryArray = Array.isArray(queries) ? queries : [queries];

    // If ANY query is loading, show the loader
    const isLoading = queryArray.some(q => q.isLoading);
    
    // If ANY query has an error, show the error state
    const firstErrorQuery = queryArray.find(q => q.isError);

    // Smart Retry: Refetch ALL queries that are in an error state
    const handleRetry = () => {
        queryArray.forEach(q => {
            if (q.isError) {
                q.refetch();
            }
        });
    };

    if (isLoading) {
        return <>{loader}</>;
    }

    if (firstErrorQuery) {
        return (
            <div className="w-full">
                <ErrorState
                    message={(firstErrorQuery.error as Error)?.message || 'فشل تحميل البيانات من الخادم.'}
                    onRetry={handleRetry}
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default QueryStateWrapper;
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

    const isLoading = queryArray.some(q => q.isLoading);
    const firstErrorQuery = queryArray.find(q => q.isError);

    if (isLoading) {
        return <>{loader}</>;
    }

    if (firstErrorQuery) {
        return (
            <div className="py-8">
                <ErrorState
                    message={(firstErrorQuery.error as Error)?.message || 'فشل تحميل البيانات.'}
                    onRetry={() => firstErrorQuery.refetch()}
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default QueryStateWrapper;
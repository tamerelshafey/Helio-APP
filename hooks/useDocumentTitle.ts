import { useEffect } from 'react';

/**
 * A hook to dynamically update the document title.
 * Resets to the original title when the component unmounts.
 * 
 * @param title The title to set
 */
const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
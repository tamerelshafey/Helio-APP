import React, { useState, useEffect } from 'react';
import { TrashIcon, CloudArrowUpIcon } from './Icons';

interface ImageUploaderProps {
    initialImages?: string[];
    onImagesChange: (images: string[]) => void;
    multiple?: boolean;
    maxFiles?: number;
    label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
    initialImages = [], 
    onImagesChange, 
    multiple = false,
    maxFiles = 5,
    label = multiple ? 'الصور' : 'الصورة'
}) => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        // Only update from props if the initialImages array is different.
        // This prevents the component from resetting when the parent re-renders
        // for other reasons, preserving the user's new selections.
        if (JSON.stringify(initialImages) !== JSON.stringify(images)) {
            setImages(initialImages);
        }
    }, [initialImages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const currentImageCount = images.length;
        const filesToProcess = Array.from(files);
        
        if (multiple && currentImageCount + filesToProcess.length > maxFiles) {
            alert(`لا يمكنك تحميل أكثر من ${maxFiles} صور.`);
            filesToProcess.splice(maxFiles - currentImageCount);
        }

        const fileReadPromises = filesToProcess.map((file: File) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        resolve(reader.result as string);
                    } else {
                        reject('Failed to read file');
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(fileReadPromises).then(newImages => {
            const updatedImages = multiple ? [...images, ...newImages] : newImages;
            setImages(updatedImages);
            onImagesChange(updatedImages);
        }).catch(error => {
            console.error("Error reading files:", error);
            alert("حدث خطأ أثناء قراءة الصور.");
        });

        // Clear the input value to allow selecting the same file again
        event.target.value = '';
    };

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    const canAddMore = multiple ? images.length < maxFiles : images.length < 1;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                        <img src={image} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg shadow-md" loading="lazy" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {canAddMore && (
                    <label className="relative flex flex-col justify-center items-center w-full h-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors">
                        <div className="text-center p-2">
                            <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {multiple ? `إضافة (${images.length}/${maxFiles})` : 'تحميل'}
                            </p>
                        </div>
                        <input
                            type="file"
                            multiple={multiple}
                            accept="image/png, image/jpeg, image/gif, image/webp"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label="Upload image"
                        />
                    </label>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
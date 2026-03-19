import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useBuilder } from './BuilderContext';
import { SortableElement } from './SortableElement';

export const Canvas: React.FC = () => {

    const { layout, deviceMode } = useBuilder();
    const { setNodeRef } = useDroppable({
        id: 'canvas-droppable',
    });

    const containerWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px'
    };

    return (
        <div className="flex-1 bg-slate-50 overflow-y-auto p-12 transition-all duration-500 flex justify-center">
            <div
                ref={setNodeRef}
                className={`bg-white shadow-2xl min-h-full h-fit transition-all duration-500 border border-slate-200 relative`}
                style={{ width: containerWidths[deviceMode] }}
            >

                {layout.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                        <div className="h-20 w-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6">
                            <div className="h-10 w-10 border-4 border-dashed border-slate-200 rounded-2xl animate-spin-slow" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Canvas is Empty</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Drag an element here to start building</p>
                    </div>
                ) : (
                    <SortableContext items={layout.map(item => item.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col">
                            {layout.map((item) => (
                                <SortableElement key={item.id} element={item} />
                            ))}
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    );
};

import { DragDropContext, Droppable, Draggable, DragEndEvent } from "@hello-pangea/dnd";
import { HomeContent } from "./types";
import { HomeContentCard } from "./HomeContentCard";

interface DraggableHomeContentProps {
  contents: HomeContent[];
  onDragEnd: (result: DragEndEvent) => void;
  onEdit: (content: HomeContent) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, currentState: boolean) => void;
}

export const DraggableHomeContent = ({
  contents,
  onDragEnd,
  onEdit,
  onDelete,
  onToggle,
}: DraggableHomeContentProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="home-content">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {contents.map((content, index) => (
              <Draggable
                key={content.id}
                draggableId={content.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transition-shadow duration-200 ${
                      snapshot.isDragging ? "shadow-lg" : ""
                    }`}
                  >
                    <HomeContentCard
                      content={content}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggle={onToggle}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
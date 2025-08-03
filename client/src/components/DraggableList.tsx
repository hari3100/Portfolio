import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { GripVertical, Edit, Trash2, Star } from 'lucide-react';

interface DraggableItem {
  id: number;
  [key: string]: any;
}

interface DraggableListProps {
  items: DraggableItem[];
  renderItem: (item: DraggableItem, isDragging: boolean) => React.ReactNode;
  onEdit?: (item: DraggableItem) => void;
  onDelete?: (id: number) => void;
  reorderEndpoint: string;
  queryKey: string[];
  itemName: string;
}

export function DraggableList({ 
  items, 
  renderItem, 
  onEdit, 
  onDelete, 
  reorderEndpoint, 
  queryKey,
  itemName 
}: DraggableListProps) {
  const [isReordering, setIsReordering] = useState(false);
  const { toast } = useToast();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex === endIndex) return;

    // Create new array with reordered items
    const reorderedItems = Array.from(items);
    const [reorderedItem] = reorderedItems.splice(startIndex, 1);
    reorderedItems.splice(endIndex, 0, reorderedItem);

    // Extract IDs in new order
    const reorderedIds = reorderedItems.map(item => item.id);

    setIsReordering(true);

    try {
      const token = localStorage.getItem('adminToken');
      await apiRequest('PUT', reorderEndpoint, { reorderedIds }, {
        'Authorization': `Bearer ${token}`
      });

      // Invalidate and refetch the data
      queryClient.invalidateQueries({ queryKey });
      
      toast({
        title: "Success",
        description: `${itemName} reordered successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to reorder ${itemName.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setIsReordering(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No {itemName.toLowerCase()} to display
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="draggable-list">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2' : ''} ${isReordering ? 'opacity-50' : ''}`}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-all duration-200 ${
                      snapshot.isDragging 
                        ? 'shadow-lg rotate-1 bg-white dark:bg-gray-800 border-primary' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="mt-1 p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {renderItem(item, snapshot.isDragging)}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {item.featured && (
                            <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(item.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

// Individual item renderers
export function BlogItemRenderer(item: any, isDragging: boolean) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
        <Badge variant="outline" className="ml-2 flex-shrink-0">
          {new Date(item.publishedAt).toLocaleDateString()}
        </Badge>
      </div>
      {item.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {item.description}
        </p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>ID: {item.id}</span>
        {item.url && (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Post
          </a>
        )}
      </div>
    </div>
  );
}

export function LinkedinItemRenderer(item: any, isDragging: boolean) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
        <Badge variant="outline" className="ml-2 flex-shrink-0">
          {item.likes} likes
        </Badge>
      </div>
      {item.content && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {item.content}
        </p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>ID: {item.id}</span>
        {item.postUrl && (
          <a 
            href={item.postUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Post
          </a>
        )}
      </div>
    </div>
  );
}

export function EducationItemRenderer(item: any, isDragging: boolean) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-sm">{item.courseName}</h3>
        <Badge variant="outline" className="ml-2 flex-shrink-0">
          {item.status}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.collegeName}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>ID: {item.id}</span>
        <span>{item.startMonth} {item.startYear} - {item.endMonth} {item.endYear}</span>
      </div>
    </div>
  );
}

export function SkillItemRenderer(item: any, isDragging: boolean) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-sm">{item.name}</h3>
        <Badge variant="outline" className="ml-2 flex-shrink-0">
          {item.category}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>ID: {item.id}</span>
        {item.logoUrl && <span>Has Logo</span>}
      </div>
    </div>
  );
}

export function CertificationItemRenderer(item: any, isDragging: boolean) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-sm">{item.title}</h3>
        <Badge variant="outline" className="ml-2 flex-shrink-0">
          {item.issuer}
        </Badge>
      </div>
      {item.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {item.description}
        </p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>ID: {item.id}</span>
      </div>
    </div>
  );
}
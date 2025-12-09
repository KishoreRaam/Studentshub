# useSavedItems Hook Documentation

Production-ready React hooks for managing saved perks, resources, and AI tools with Appwrite.

## Features

- ✅ Full TypeScript/JavaScript support
- ✅ Automatic authentication handling with 401 error detection
- ✅ Toast notifications for user feedback
- ✅ Optimistic UI updates
- ✅ Race condition handling
- ✅ Auto-redirect to login on session expiry

## Installation

The hooks are already configured and ready to use. Make sure you have:

```javascript
import { useSavePerk, useSaveResource, useSaveAITool, useToggleSave, useSavedCounts } from '../hooks/useSavedItems';
```

## Usage Examples

### 1. Save/Unsave a Perk

```jsx
import { useSavePerk } from '../hooks/useSavedItems';

function PerkCard({ perk }) {
  const { savePerk, unsavePerk, isSaving, error } = useSavePerk();

  const handleSave = async () => {
    try {
      await savePerk(perk.id, {
        title: perk.title,
        category: perk.category,
        description: perk.description,
        website: perk.website,
        logo: perk.logo,
        color: perk.color,
        discount: perk.discount,
        validUntil: perk.validity,
        claimLink: perk.claimLink,
      });
    } catch (err) {
      console.error('Failed to save perk:', err);
    }
  };

  const handleUnsave = async () => {
    try {
      await unsavePerk(perk.id);
    } catch (err) {
      console.error('Failed to unsave perk:', err);
    }
  };

  return (
    <div>
      <h3>{perk.title}</h3>
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>
      <button onClick={handleUnsave} disabled={isSaving}>
        Remove
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### 2. Save/Unsave a Resource

```jsx
import { useSaveResource } from '../hooks/useSavedItems';

function ResourceCard({ resource }) {
  const { saveResource, unsaveResource, isSaving } = useSaveResource();

  const handleToggle = async (shouldSave) => {
    if (shouldSave) {
      await saveResource(resource.id, {
        title: resource.title,
        category: resource.category,
        description: resource.description,
        link: resource.link,
        type: resource.type,
        provider: resource.provider,
      });
    } else {
      await unsaveResource(resource.id);
    }
  };

  return (
    <div>
      <h3>{resource.title}</h3>
      <button onClick={() => handleToggle(true)} disabled={isSaving}>
        Save Resource
      </button>
    </div>
  );
}
```

### 3. Save/Unsave an AI Tool

```jsx
import { useSaveAITool } from '../hooks/useSavedItems';

function AIToolCard({ tool }) {
  const { saveAITool, unsaveAITool, isSaving } = useSaveAITool();

  const handleSave = async () => {
    await saveAITool(tool.id, {
      title: tool.name,
      category: tool.category,
      description: tool.description,
      link: tool.link,
      pricing: tool.pricing,
      logo: tool.logo,
    });
  };

  return (
    <div>
      <h3>{tool.name}</h3>
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save AI Tool'}
      </button>
    </div>
  );
}
```

### 4. Universal Toggle Hook (Recommended)

Best for components that need to show saved state and toggle between save/unsave:

```jsx
import { useToggleSave } from '../hooks/useSavedItems';

function UniversalCard({ item, type }) {
  const { toggleSave, isSaved, isLoading } = useToggleSave(item.id, type);

  const handleClick = async () => {
    await toggleSave({
      title: item.title,
      category: item.category,
      description: item.description,
      // ... other item data
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h3>{item.title}</h3>
      <button onClick={handleClick}>
        {isSaved ? '❤️ Saved' : '🤍 Save'}
      </button>
    </div>
  );
}

// Usage
<UniversalCard item={perk} type="perk" />
<UniversalCard item={resource} type="resource" />
<UniversalCard item={aiTool} type="aiTool" />
```

### 5. Get Saved Items Count

Display counts in dashboard or header:

```jsx
import { useSavedCounts } from '../hooks/useSavedItems';

function Dashboard() {
  const { counts, isLoading, refresh } = useSavedCounts();

  return (
    <div>
      <h2>My Saved Items</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Total: {counts.total}</p>
          <p>Perks: {counts.perks}</p>
          <p>Resources: {counts.resources}</p>
          <p>AI Tools: {counts.aiTools}</p>
          <button onClick={refresh}>Refresh</button>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### `useSavePerk()`

Returns:
- `savePerk(perkId, perkData)` - Save a perk
- `unsavePerk(perkId)` - Unsave a perk
- `isSaving` - Boolean loading state
- `error` - Error message if any

### `useSaveResource()`

Returns:
- `saveResource(resourceId, resourceData)` - Save a resource
- `unsaveResource(resourceId)` - Unsave a resource
- `isSaving` - Boolean loading state
- `error` - Error message if any

### `useSaveAITool()`

Returns:
- `saveAITool(toolId, toolData)` - Save an AI tool
- `unsaveAITool(toolId)` - Unsave an AI tool
- `isSaving` - Boolean loading state
- `error` - Error message if any

### `useToggleSave(itemId, type)`

Parameters:
- `itemId` - The ID of the item
- `type` - One of: `'perk'`, `'resource'`, or `'aiTool'`

Returns:
- `toggleSave(itemData)` - Toggle save/unsave state
- `isSaved` - Boolean saved state
- `isLoading` - Boolean loading state
- `error` - Error message if any

### `useSavedCounts()`

Returns:
- `counts` - Object with `{ perks, resources, aiTools, total }`
- `isLoading` - Boolean loading state
- `refresh()` - Function to manually refresh counts

## Error Handling

All hooks automatically handle:

1. **401 Unauthorized**: Auto-redirects to `/login` with toast notification
2. **409 Conflict**: Handles race conditions when item already saved
3. **Network errors**: Shows error toast with retry option

## Collection Structure

The hooks expect the following Appwrite collections:

### saved_perks
- `userID` (string)
- `perkID` (string)
- `title` (string)
- `category` (string)
- `description` (string)
- `website` (string)
- `logo` (string)
- `color` (string)
- `discount` (string)
- `validUntil` (string)
- `claimLink` (string)
- `claimed` (boolean)
- `claimedDate` (datetime)

### saved_resources
- `userID` (string)
- `resourceID` (string)
- `title` (string)
- `category` (string)
- `description` (string)
- `link` (string)
- `type` (string)
- `provider` (string)

### saved_ai_tools
- `userID` (string)
- `aiToolID` (string)
- `title` (string)
- `category` (string)
- `description` (string)
- `link` (string)
- `pricing` (string)
- `logo` (string)

## Permissions Setup

**IMPORTANT**: The hooks no longer set document-level permissions. You must configure collection-level permissions in Appwrite Console:

1. Go to your Appwrite Console
2. Navigate to each collection: `saved_perks`, `saved_resources`, `saved_ai_tools`
3. Set permissions:
   - **Create**: `Any authenticated user` or `Role: users`
   - **Read**: `Users` (so users can only read their own documents)
   - **Update**: `Users` (so users can only update their own documents)
   - **Delete**: `Users` (so users can only delete their own documents)

Or use these permission rules:
```
Create: role:all
Read: user:[userId]
Update: user:[userId]
Delete: user:[userId]
```

This ensures users can only access their own saved items while avoiding 401 authorization errors.

## Best Practices

1. **Always pass complete item data** when saving to ensure all fields are stored
2. **Use `useToggleSave`** for most use cases - it's the most convenient
3. **Handle loading states** in your UI to prevent duplicate saves
4. **Don't retry on 401 errors** - they're handled automatically with redirect
5. **Use optimistic UI updates** for better user experience

## Migration from Old Service

If you're using the old `saved-items.service.ts`, you can gradually migrate:

```jsx
// Old way
import { savePerk } from '../services/saved-items.service';

// New way
import { useSavePerk } from '../hooks/useSavedItems';
```

The hooks provide better React integration, automatic error handling, and loading states.

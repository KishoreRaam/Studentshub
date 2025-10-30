# Saved Perks Fix - Required Appwrite Schema Update

## Problem Solved
Previously, saved perks weren't showing in the dashboard because the system was trying to join data from a SAVED_PERKS collection (which only stored IDs) with a PERKS collection (which was empty).

The fix stores complete perk data directly in the SAVED_PERKS collection, eliminating the need for a separate PERKS collection.

## Required Action: Update SAVED_PERKS Collection Schema

You **MUST** add the following attributes to your existing `SAVED_PERKS` collection in Appwrite:

### Step-by-Step Instructions

1. **Go to Appwrite Console**
   - Navigate to: https://cloud.appwrite.io/console
   - Select your project
   - Go to Databases → Your Database → SAVED_PERKS collection

2. **Add These New Attributes**

Click "Add Attribute" for each of the following:

| Attribute Name | Type | Size | Required | Default |
|---------------|------|------|----------|---------|
| `title` | String | 255 | No | (empty) |
| `category` | String | 100 | No | (empty) |
| `description` | String | 2000 | No | (empty) |
| `website` | String | 500 | No | (empty) |
| `logo` | String | 500 | No | (empty) |
| `color` | String | 50 | No | #3B82F6 |
| `discount` | String | 100 | No | (empty) |
| `validUntil` | String | 100 | No | (empty) |
| `claimLink` | String | 500 | No | (empty) |

3. **Keep Existing Attributes**

Don't remove these (they should already exist):
- `userID` (String, required)
- `perkID` (String, required)
- `claimed` (Boolean)
- `claimedDate` (DateTime)

### Final Schema

After adding the new attributes, your SAVED_PERKS collection should have:

**Complete Attribute List:**
```
1. userID         (String, required)   - User who saved the perk
2. perkID         (String, required)   - Perk ID from CSV
3. title          (String, optional)   - Perk title
4. category       (String, optional)   - Perk category
5. description    (String, optional)   - Perk description
6. website        (String, optional)   - Company website
7. logo           (String, optional)   - Logo URL
8. color          (String, optional)   - Brand color
9. discount       (String, optional)   - Discount amount
10. validUntil    (String, optional)   - How long it's valid
11. claimLink     (String, optional)   - URL to claim the perk
12. claimed       (Boolean, optional)  - Whether user claimed it
13. claimedDate   (DateTime, optional) - When it was claimed
```

## What Changed in the Code

### 1. Service Layer (`src/services/saved-items.service.ts`)
- `savePerk()` now accepts full perk object and stores all fields
- `getSavedPerks()` now reads directly from SAVED_PERKS (no join with PERKS collection)

### 2. Hook Layer (`src/hooks/useSavedItems.ts`)
- `saveItem()` and `toggleSave()` now accept full perk data

### 3. Component Layer (`src/components/DetailedPerkCard.tsx`)
- Save button now passes complete perk object instead of just ID

## Testing the Fix

After updating the Appwrite schema:

1. **Clear old saved perks** (optional, but recommended):
   - Go to Appwrite Console → SAVED_PERKS collection
   - Delete all existing documents (they only have IDs, not full data)

2. **Test saving a new perk**:
   ```
   - Run: npm run dev
   - Go to the Perks page
   - Click on any perk to open details
   - Click "Save for Later"
   - Should see success message
   ```

3. **Verify in dashboard**:
   ```
   - Go to Dashboard page
   - Should see the saved perk displayed with:
     - Title
     - Category
     - Description
     - Logo (if available)
     - Claim button
   ```

4. **Check Appwrite Console**:
   - Open SAVED_PERKS collection
   - Look at a saved perk document
   - Should see all fields populated (title, category, description, etc.)

## Benefits of This Approach

✅ **No dependency** on separate PERKS collection
✅ **Faster queries** - single collection read instead of join
✅ **Simpler architecture** - one source of truth
✅ **Works with CSV** - maintains existing CSV-based perks page
✅ **Backward compatible** - old saves work (just missing extra fields)

## Troubleshooting

**Problem**: "Attribute does not exist" error when saving
- **Solution**: Make sure you added ALL the new attributes listed above

**Problem**: Saved perks still not showing
- **Solution**:
  1. Check browser console for errors
  2. Verify all attributes were added
  3. Try clearing old saved perks and saving new ones
  4. Check Appwrite permissions allow users to create/read documents

**Problem**: Some fields are missing in dashboard
- **Solution**: The perk might have been saved before the schema update. Delete and re-save it.

## Notes

- This fix only applies to perks. Resources and AI Tools still use the old join approach (they have actual Appwrite collections).
- If you want to apply the same fix to resources/AI tools later, follow the same pattern.
- The PERKS collection is no longer needed and can be deleted or left empty.

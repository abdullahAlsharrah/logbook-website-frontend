# Level System Implementation - Summary

## 🎯 Changes Implemented

### 1. **Main Page Changed to Institutions**

- ✅ Default route changed from `/dashboard` to `/institutions`
- ✅ Landing page is now the Institutions list
- ✅ Admin workflow: Select Institution → View Users/Forms/Submissions

### 2. **Level Management System Added**

#### New Components Created:

1. **`LevelBadge.js`** - Displays resident level badges with colors

   - R1: Blue (Info)
   - R2: Dark Blue (Primary)
   - R3: Yellow (Warning)
   - R4: Green (Success)
   - R5: Red (Danger/Senior)

2. **`ManageLevelsModal.js`** - Modal for managing resident levels
   - Shows all institutions user belongs to
   - Displays current level for each institution
   - Allows updating level per institution
   - Built-in validation and feedback

#### API Functions Added:

- `updateUserLevel(userId, levelData)` - Updates resident level in an institution
- Hook: `useUpdateUserLevel()` - React Query mutation for level updates

### 3. **Users Page Enhanced**

#### New Features:

- ✅ Level badges displayed next to each institution (for residents only)
- ✅ "Manage Levels" option in user actions dropdown (residents only)
- ✅ Institution filter dropdown (local filtering)
- ✅ Shows institution-specific levels in user table

#### User Table Now Shows:

- User info with avatar
- Email
- Role badges
- **Institution badges with level indicators** ← NEW
- Submissions count
- Supervisor (if resident)
- Actions dropdown with "Manage Levels" option

### 4. **Form Creation/Editing Enhanced**

#### New Fields Added to Forms:

- ✅ `levelRestricted` - Boolean to enable/disable restrictions
- ✅ `minLevel` - Minimum resident level (R1-R5)
- ✅ `maxLevel` - Maximum resident level (optional)

#### UI Features:

- "Resident Level Restrictions" card in form editor
- Checkbox to enable restrictions
- Dropdown selectors for min/max levels
- Live preview of who can access the form
- Helpful descriptions for each field

#### Example Configuration:

```javascript
{
  formName: "Advanced Surgical Procedures",
  levelRestricted: true,
  minLevel: "R3",
  maxLevel: "",  // No maximum
  // Result: Only R3, R4, R5 residents can access
}
```

### 5. **Forms Page Enhanced**

#### New Features:

- ✅ Level restriction badge shown on form cards
- ✅ Shows "Level: R3+" if form has minimum level requirement
- ✅ Warning color badge for easy visibility

---

## 📱 User Workflows

### Workflow 1: Manage Resident Levels

1. Navigate to **Institutions** (landing page)
2. Select an institution
3. Go to **Users** page
4. Find a resident
5. Click actions (⋮) → **Manage Levels**
6. Modal opens showing all institutions
7. Select institution to update level in
8. Choose new level from dropdown
9. Click **Update Level**
10. Level updated, data refreshes automatically

### Workflow 2: Create Level-Restricted Form

1. Navigate to **Institutions**
2. Select an institution
3. Go to **Forms** page
4. Click **Create New Form**
5. Fill in basic information
6. In "Resident Level Restrictions" section:
   - Check "Enable Level Restrictions"
   - Select Minimum Level (e.g., R3)
   - Optionally select Maximum Level
7. See live preview: "Residents R3 and above"
8. Add field templates as normal
9. **Save Form**

### Workflow 3: View Users by Institution with Levels

1. Navigate to **Institutions** (landing page)
2. Select institution from list
3. Global institution selector updates
4. Go to **Users**
5. See all users from that institution
6. Residents show level badges next to institution names
7. Use local institution filter for more specific filtering

---

## 🎨 Visual Indicators

### Level Badge Colors:

- **No Level**: Gray badge with "No Level"
- **R1**: Blue - First Year
- **R2**: Dark Blue - Second Year
- **R3**: Yellow - Third Year
- **R4**: Green - Fourth Year
- **R5**: Red - Fifth Year (Senior)

### Form Badges:

- **Institution**: Blue badge with building icon
- **Level Restriction**: Yellow badge showing "Level: R3+"

---

## 🔧 Technical Details

### State Management:

- Institution context provides global state
- React Query handles data fetching and caching
- Automatic cache invalidation on level updates

### Data Flow:

1. User updates level → API call
2. React Query mutation executes
3. Cache invalidated for users/user data
4. UI automatically refreshes with new levels

### API Endpoints Used:

```
PATCH /users/:userId/level
Body: { level: "R3", institutionId: "inst123" }

GET /formTemplates?institutionId=xxx
→ Returns forms with level restrictions

POST /formTemplates
Body: {
  formName: "...",
  levelRestricted: true,
  minLevel: "R3",
  maxLevel: ""
}
```

---

## 📊 Files Modified

### New Files:

1. `src/components/LevelBadge.js` - Level badge component
2. `src/components/ManageLevelsModal.js` - Level management modal

### Modified Files:

1. `src/App.js` - Changed default route to `/institutions`
2. `src/api/users.js` - Added `updateUserLevel()` function
3. `src/hooks/useUsers.js` - Added `useUpdateUserLevel()` hook
4. `src/pages/Users.js` - Added level management UI and features
5. `src/pages/FormEdit.js` - Added level restriction fields
6. `src/pages/Forms.js` - Added level restriction badges

---

## ✅ Features Completed

### Institution-Centric Design:

- [x] Institutions page is the landing page
- [x] Institution selection drives all data views
- [x] Global institution selector in header
- [x] Local institution filters on data pages

### Level Management:

- [x] Level badges on users table
- [x] Manage Levels modal for residents
- [x] Update level per institution
- [x] Visual indicators with colors
- [x] Level displayed next to institution names

### Form Restrictions:

- [x] Level-restricted forms
- [x] Min/max level configuration
- [x] Level badges on form cards
- [x] Live preview of accessibility
- [x] Backward compatible (old forms work fine)

---

## 🚀 Next Steps (Future Enhancements)

### Recommended:

1. **Field-Level Option Restrictions** - Lock specific options by level
2. **Analytics Dashboard** - Show level distribution per institution
3. **Bulk Level Updates** - Promote multiple residents at once
4. **Level History** - Track level changes over time
5. **Auto-promotion** - Automatic level updates based on dates

### Optional:

- Level-based notifications
- Progress tracking dashboards
- Custom level names per institution
- Level-based permissions beyond forms

---

## 📝 Testing Checklist

### Level Management:

- [ ] Update resident level in one institution
- [ ] Verify level shows in users table
- [ ] Verify level persists after page refresh
- [ ] Try updating level for multi-institution resident

### Form Restrictions:

- [ ] Create form with min level requirement
- [ ] Verify level badge shows on form card
- [ ] Edit form to change level requirement
- [ ] Create form without restrictions (should work normally)

### Navigation:

- [ ] Verify landing on `/institutions` after login
- [ ] Select institution and navigate to users
- [ ] Verify data filters by institution
- [ ] Test institution selector in header

---

## 💡 Tips for Admins

1. **Set Levels Early**: Assign resident levels when they join
2. **Review Quarterly**: Update levels as residents progress
3. **Start Simple**: Begin with minimal form restrictions
4. **Communicate**: Inform residents when their level changes
5. **Use Badges**: Visual indicators help identify residents quickly

---

## 🎉 Summary

The admin dashboard now has:

- **Institution-first workflow** - Select institution, then view data
- **Complete level system** - Manage resident levels per institution
- **Form restrictions** - Control access based on training level
- **Visual indicators** - Color-coded badges for quick identification
- **Seamless UX** - Intuitive modals and dropdowns

All features are fully integrated with your existing multi-institution system!

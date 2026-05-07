# Debug Guide: Money Transactions Not Storing

## 🔍 Debugging Steps

### Step 1: Open Browser Console
1. Open the application: http://localhost:5173/
2. Press **F12** to open Developer Tools
3. Click on the **Console** tab
4. Keep it open while testing

### Step 2: Check Console Logs
When you add a transaction, you should see these logs:

```
[API] Adding money transaction: {date: "2026-05-07", type: "credit", ...}
[API] Existing transactions from localStorage: [...]
[API] Parsed transactions array, length: X
[API] New transaction created: {...}
[API] Transaction added to array, new length: X+1
[API] Saved to localStorage
[API] Verification: localStorage now has X+1 transactions
Saving transaction with payload: {...}
Add result: {success: true, transaction: {...}}
Transaction saved and dashboard reloaded
[API] Getting money transactions from localStorage: [...]
[API] Parsed transactions, count: X+1
[API] Normalized transactions, count: X+1
```

### Step 3: Check LocalStorage Directly
1. In Developer Tools, click on **Application** tab
2. In the left sidebar, expand **Local Storage**
3. Click on `http://localhost:5173`
4. Look for key: `mockMoneyTransactions`
5. Click on it to see the value
6. It should be a JSON array with all your transactions

### Step 4: Test LocalStorage Independently
1. Open this test page: `file:///C:/Users/M%20Sravani/Desktop/employee%20protol/employee-protol/test-localstorage.html`
2. Click "Add Test Transaction" button
3. Click "View All Transactions" button
4. Verify transactions are being stored

---

## 🐛 Common Issues & Solutions

### Issue 1: "Image uploads but data not storing"

**Possible Causes:**
1. LocalStorage is full (5-10MB limit)
2. Browser privacy mode blocking localStorage
3. JavaScript error preventing save
4. Race condition between upload and save

**Solutions:**

**A. Clear LocalStorage:**
```javascript
// In browser console, run:
localStorage.clear();
location.reload();
```

**B. Check LocalStorage Size:**
```javascript
// In browser console, run:
let total = 0;
for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
    }
}
console.log('LocalStorage size:', (total / 1024).toFixed(2), 'KB');
```

**C. Check for Errors:**
- Look in Console tab for red error messages
- Check if any errors occur when clicking "Add Transaction"

---

### Issue 2: "Success message shows but transaction disappears"

**Possible Causes:**
1. Page is reloading/refreshing
2. Another tab is clearing localStorage
3. Browser extension interfering

**Solutions:**

**A. Disable Browser Extensions:**
- Open in Incognito/Private mode
- Test if transactions persist

**B. Check for Page Reloads:**
- Watch the Network tab
- If page reloads, check for redirect code

---

### Issue 3: "Only last transaction visible"

**Possible Causes:**
1. Array is being replaced instead of appended
2. Old code still cached

**Solutions:**

**A. Hard Refresh:**
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

**B. Clear Browser Cache:**
1. F12 → Network tab
2. Right-click → Clear browser cache
3. Refresh page

---

## 🧪 Manual Testing Script

Run this in the browser console to test localStorage:

```javascript
// Test 1: Add a transaction
function testAddTransaction() {
    const transactions = JSON.parse(localStorage.getItem('mockMoneyTransactions') || '[]');
    console.log('Before:', transactions.length, 'transactions');
    
    transactions.push({
        id: 'TEST-' + Date.now(),
        transactionId: 'TXN-TEST-' + Date.now(),
        date: '2026-05-07',
        type: 'credit',
        amount: 5000,
        mode: 'phonepe',
        category: 'Test',
        notes: 'Manual test',
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('mockMoneyTransactions', JSON.stringify(transactions));
    
    const after = JSON.parse(localStorage.getItem('mockMoneyTransactions') || '[]');
    console.log('After:', after.length, 'transactions');
    console.log('Success:', after.length === transactions.length);
}

// Test 2: View all transactions
function testViewTransactions() {
    const transactions = JSON.parse(localStorage.getItem('mockMoneyTransactions') || '[]');
    console.log('Total transactions:', transactions.length);
    console.table(transactions);
}

// Test 3: Clear all transactions
function testClearTransactions() {
    localStorage.removeItem('mockMoneyTransactions');
    console.log('Cleared. Now has:', JSON.parse(localStorage.getItem('mockMoneyTransactions') || '[]').length);
}

// Run tests
console.log('=== Running Tests ===');
testAddTransaction();
testViewTransactions();
```

---

## 📊 Expected Behavior

### When Adding a Transaction:

1. **Form Submission:**
   - User fills form
   - Uploads image (optional for admin, required for employee)
   - Clicks "Add Transaction"

2. **Image Upload (if file selected):**
   - Shows "Uploading..." state
   - Uploads to Cloudinary
   - Gets back image URL
   - Console shows: "Image uploaded successfully: https://..."

3. **Data Save:**
   - Creates transaction object with all data
   - Gets existing transactions from localStorage
   - Adds new transaction to array
   - Saves array back to localStorage
   - Console shows: "[API] Saved to localStorage"

4. **UI Update:**
   - Shows success message
   - Resets form
   - Reloads dashboard
   - New transaction appears in list

5. **Verification:**
   - Transaction visible in list
   - Can be edited/deleted
   - Persists after page refresh

---

## 🔧 Quick Fixes

### Fix 1: Force Clear and Restart

```javascript
// Run in console:
localStorage.clear();
location.reload();
```

Then try adding a transaction again.

---

### Fix 2: Check Browser Compatibility

Ensure you're using a modern browser:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

---

### Fix 3: Verify Code Changes Applied

1. Stop the frontend server (Ctrl+C)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart frontend: `npm run dev`
4. Hard refresh browser (Ctrl+Shift+R)

---

## 📞 Still Not Working?

If transactions still aren't storing after trying all the above:

1. **Export Console Logs:**
   - Right-click in Console tab
   - Click "Save as..."
   - Share the log file

2. **Check LocalStorage Contents:**
   ```javascript
   // Run in console:
   console.log('mockMoneyTransactions:', localStorage.getItem('mockMoneyTransactions'));
   ```

3. **Test with Simple Data:**
   ```javascript
   // Run in console:
   localStorage.setItem('test', 'hello');
   console.log('Test:', localStorage.getItem('test'));
   ```
   
   If this doesn't work, localStorage is blocked by browser settings.

---

## 🎯 Next Steps

After debugging:

1. If localStorage works in test but not in app → Code issue
2. If localStorage doesn't work at all → Browser/privacy issue
3. If transactions save but disappear → Reload/refresh issue

Let me know what you find in the console logs!

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #eef1f5;
            color: #333;
        }

        .dashboard-container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 30px;
            background-color: #ffffff;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
        }

        .profile-section {
            display: flex;
            align-items: center;
            padding-bottom: 25px;
            border-bottom: 1px solid #e0e0e0;
            position: relative;
        }

        .profile-pic-container {
            position: relative;
            margin-right: 25px;
            cursor: pointer;
        }

        .profile-pic {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            border: 4px solid #6c5ce7;
            box-shadow: 0 0 10px rgba(108, 92, 231, 0.4);
        }

        .profile-pic-edit-btn {
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .profile-info {
            flex-grow: 1;
        }

        .profile-info h1 {
            margin: 0;
            font-size: 28px;
            color: #2c3e50;
            font-weight: 600;
        }

        .profile-info p {
            margin: 5px 0 0;
            color: #7f8c8d;
            font-size: 16px;
        }

        .profile-section .logout-btn {
            background-color: #6c5ce7;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
            margin-left: 10px;
            transition: background-color 0.3s ease;
        }

        .profile-section .logout-btn:hover {
            background-color: #5b4acb;
        }
        
        /* New section for profile picture save */
        .profile-pic-fields {
            display: none;
            margin-top: 10px;
        }
        .profile-pic-fields input {
            display: none;
        }
        .profile-pic-fields label {
            background-color: #f0f0f0;
            border: 2px dashed #ccc;
            border-radius: 8px;
            padding: 8px 15px;
            cursor: pointer;
            font-size: 14px;
        }
        .profile-pic-fields button {
            background-color: #2ecc71;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
        }

        .nav-bar {
            display: flex;
            justify-content: space-around;
            list-style: none;
            padding: 0;
            margin: 30px 0;
            background: #f8f9fa;
            border-radius: 10px;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
        }

        .nav-bar li {
            flex-grow: 1;
        }

        .nav-bar a {
            display: block;
            padding: 18px;
            text-align: center;
            text-decoration: none;
            color: #34495e;
            font-weight: 600;
            transition: background-color 0.3s, color 0.3s;
            border-radius: 10px;
        }

        .nav-bar a:hover,
        .nav-bar a.active {
            background-color: #6c5ce7;
            color: #fff;
            box-shadow: 0 4px 10px rgba(108, 92, 231, 0.3);
        }

        .content-section {
            display: none;
            padding-top: 20px;
        }

        .content-section.active {
            display: block;
        }

        .property-card {
            background-color: #fcfcfc;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
            position: relative;
        }

        .card-buttons {
            position: absolute;
            top: 15px;
            right: 15px;
            display: flex;
            gap: 10px;
        }

        .delete-btn,
        .edit-btn,
        .save-btn {
            border: none;
            padding: 8px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s, transform 0.2s;
            z-index: 10;
        }

        .delete-btn {
            background-color: #e74c3c;
            color: white;
        }
        
        .edit-btn {
            background-color: #3498db;
            color: white;
        }

        .save-btn {
            background-color: #2ecc71;
            color: white;
            display: none; /* Initially hidden */
        }

        .save-btn.active {
            display: flex;
        }

        .delete-btn:hover,
        .edit-btn:hover,
        .save-btn:hover {
            transform: scale(1.05);
        }

        .property-card input:not([type="file"]),
        .property-card textarea {
            border: none;
            background: transparent;
            outline: none;
            padding: 5px;
            width: 100%;
            font-size: 16px;
            color: #333;
            border-bottom: 1px solid #ccc;
            pointer-events: none; /* Initially disabled */
        }

        .property-card input.editable,
        .property-card textarea.editable {
            pointer-events: auto; /* Enabled when in edit mode */
            border-bottom: 1px solid #6c5ce7;
        }

        .property-details-row {
            margin-top: 15px;
        }
        
        /* New flexbox styles for property fields */
        .property-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        .property-info-field {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-basis: calc(50% - 10px); /* Two columns on large screens */
        }

        .property-info-field strong {
            flex-shrink: 0;
        }
        
        /* Responsive design for mobile devices */
        @media (max-width: 768px) {
            .property-info-field {
                flex-basis: 100%; /* One column on small screens */
            }
        }

        .add-plot-container,
        .add-flat-container {
            text-align: center;
            margin-bottom: 20px;
        }

        .add-new-btn {
            background-color: #6c5ce7;
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.3s ease;
        }

        .add-new-btn:hover {
            background-color: #5b4acb;
        }

        .property-sub-nav {
            display: flex;
            list-style: none;
            padding: 0;
            margin: 15px 0;
            justify-content: space-around;
            position: relative;
        }

        .property-sub-nav li {
            flex-grow: 1;
            text-align: center;
        }

        .property-sub-nav a {
            display: block;
            text-decoration: none;
            color: #7f8c8d;
            font-weight: 500;
            padding: 10px 0;
            transition: all 0.3s ease;
        }

        .property-sub-nav a:hover,
        .property-sub-nav a.sub-active {
            background-color: transparent;
            color: #6c5ce7;
        }

        .property-sub-nav::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #ecf0f1;
        }

        .property-sub-nav .sub-active-line {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            background-color: #6c5ce7;
            transition: all 0.3s ease;
        }

        .property-details-content {
            display: none;
            padding-top: 20px;
        }

        .property-details-content.sub-active {
            display: block;
        }

        .file-upload-container {
            margin-top: 20px;
            display: none; /* Hiding the upload section initially */
        }

        .file-upload-container.editable {
            display: block;
        }

        .file-upload-container p {
            font-weight: 500;
            color: #2c3e50;
        }
        .file-upload-container .upload-label {
            display: inline-block;
            background-color: #f0f0f0;
            border: 2px dashed #ccc;
            border-radius: 8px;
            padding: 15px 25px;
            cursor: pointer;
            transition: border-color 0.3s, background-color 0.3s;
        }

        .file-upload-container .upload-label:hover {
            background-color: #e9e9e9;
            border-color: #888;
        }

        .uploaded-photos,
        .uploaded-docs {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 20px;
        }

        .uploaded-item {
            position: relative;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 8px;
            text-align: center;
            background-color: #fafafa;
        }

        .uploaded-item img {
            max-width: 120px;
            max-height: 120px;
            display: block;
            border-radius: 6px;
        }

        .delete-file-btn {
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s;
        }

        .delete-file-btn:hover {
            background-color: #c0392b;
        }
    </style>
</head>
<body>

    <div class="dashboard-container">
        <div class="profile-section">
            <div class="profile-pic-container">
                <img id="profile-pic" src="https://via.placeholder.com/90" alt="Profile Picture" class="profile-pic">
                <button class="profile-pic-edit-btn" title="Edit Profile Picture">✏️</button>
            </div>
            <div class="profile-info">
                <h1>Hey <%= user.email.split('@')[0] %></h1>
                <p>Welcome to your dashboard.</p>
            </div>
            <button class="logout-btn" onclick="window.location.href='/logout'">Logout</button>
        </div>
        
        <div class="profile-pic-fields">
            <label for="profile-photo-upload">
                <span>Select a new photo</span>
                <input type="file" id="profile-photo-upload" accept="image/jpeg, image/png" style="display: none;">
            </label>
            <button id="save-profile-pic-btn">Save</button>
        </div>

        <ul class="nav-bar">
            <li><a href="#" class="nav-link active" data-target="my-plots">My Plots</a></li>
            <li><a href="#" class="nav-link" data-target="my-flats">My Flats</a></li>
            <li><a href="#" class="nav-link" data-target="other-properties">Other Properties</a></li>
        </ul>

        <div id="my-plots" class="content-section active">
            <div class="add-plot-container">
                <button id="add-new-plot-btn" class="add-new-btn">Add New Plot</button>
            </div>
            <div class="property-list-container plot-list">
                </div>
        </div>

        <div id="my-flats" class="content-section">
            <div class="add-flat-container">
                <button id="add-new-flat-btn" class="add-new-btn">Add New Flat</button>
            </div>
            <div class="property-list-container flat-list">
                </div>
        </div>

        <div id="other-properties" class="content-section">
            <p>Details for Other Properties will appear here.</p>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const plotListContainer = document.querySelector('.plot-list');
            const flatListContainer = document.querySelector('.flat-list');
            const navLinks = document.querySelectorAll('.nav-link');
            const addNewPlotBtn = document.getElementById('add-new-plot-btn');
            const addNewFlatBtn = document.getElementById('add-new-flat-btn');

            const initialProperties = JSON.parse('<%- properties %>');

            // --- HTML templates ---
            const plotCardTemplate = (property) => `
                <div class="property-card" data-id="${property._id}">
                    <div class="card-buttons">
                        <button class="edit-btn" aria-label="Edit Plot">✏️</button>
                        <button class="save-btn" aria-label="Save Plot">💾</button>
                        <button class="delete-btn" aria-label="Delete Plot">🗑️</button>
                    </div>
                    <div class="plot-details-header">
                        <h3><input type="text" class="property-name-input" placeholder="Enter Plot Name" value="${property.name || ''}" disabled></h3>
                    </div>
                    <div class="property-details-row">
                        <div class="property-info">
                            <div class="property-info-field">
                                <strong>Location:</strong>
                                <input type="text" class="property-location-input" placeholder="Enter Location" value="${property.location || ''}" disabled>
                            </div>
                            <div class="property-info-field">
                                <strong>Number of sq yards:</strong>
                                <input type="number" class="property-sqyards-input" placeholder="Enter Sq Yards" value="${property.sqYards || ''}" disabled>
                            </div>
                            <div class="property-info-field">
                                <strong>Additional Details:</strong>
                                <input type="text" class="property-additional-input" placeholder="Enter Details" value="${property.additionalDetails || ''}" disabled>
                            </div>
                            <div class="property-info-field">
                                <strong>Address:</strong>
                                <input type="text" class="property-address-input" placeholder="Enter Address" value="${property.address || ''}" disabled>
                            </div>
                            <div class="property-info-field">
                                <strong>Date of purchase:</strong>
                                <input type="date" class="property-purchase-date-input" placeholder="Enter Date" value="${property.purchaseDate ? new Date(property.purchaseDate).toISOString().split('T')[0] : ''}" disabled>
                            </div>
                            <div class="property-info-field">
                                <strong>Price when purchased:</strong>
                                <input type="number" class="property-purchase-price-input" placeholder="Enter Price" value="${property.purchasePrice || ''}" disabled>
                            </div>
                        </div>
                    </div>
                    
                    <ul class="property-sub-nav">
                        <li><a href="#" class="sub-nav-link active" data-sub-target="gallery">Gallery</a></li>
                        <li><a href="#" class="sub-nav-link" data-sub-target="legal-details">Legal Details</a></li>
                        <li><a href="#" class="sub-nav-link" data-sub-target="suggested-services">Suggestions & Advice</a></li>
                        <div class="sub-active-line"></div>
                    </ul>

                    <div class="property-details-content sub-active" data-sub-content="gallery">
                        <div class="file-upload-container">
                             <p>Add Property Photos (JPEG, PNG):</p>
                             <label for="property-photo-upload-${property._id}" class="upload-label">
                                 <input type="file" id="property-photo-upload-${property._id}" class="property-photo-upload" accept="image/jpeg, image/png" multiple style="display: none;">
                                 <span>Click to Add Photos</span>
                             </label>
                             <div class="uploaded-photos"></div>
                        </div>
                    </div>
                    <div class="property-details-content" data-sub-content="legal-details">
                        <div class="file-upload-container">
                            <p>Add Legal Documents (PDF, DOCX):</p>
                             <label for="legal-doc-upload-${property._id}" class="upload-label">
                                <input type="file" id="legal-doc-upload-${property._id}" class="legal-doc-upload" accept=".pdf, .docx" multiple style="display: none;">
                                <span>Click to Add Documents</span>
                            </label>
                            <div class="uploaded-docs"></div>
                        </div>
                    </div>
                    <div class="property-details-content" data-sub-content="suggested-services">
                        <h3>Your Suggestions</h3>
                        <p>Add your own notes here:</p>
                        <textarea class="suggestions-text" placeholder="Start typing..." disabled>${property.suggestions || ''}</textarea>
                        <h3>Expert Advice</h3>
                        <p>Add notes or advice from your real estate agent or expert here:</p>
                        <textarea class="expert-advice-text" placeholder="Start typing..." disabled>${property.expertAdvice || ''}</textarea>
                    </div>
                </div>
            `;

            const flatCardTemplate = (property) => `
                <div class="property-card" data-id="${property._id}">
                    <div class="card-buttons">
                        <button class="edit-btn" aria-label="Edit Flat">✏️</button>
                        <button class="save-btn" aria-label="Save Flat">💾</button>
                        <button class="delete-btn" aria-label="Delete Flat">🗑️</button>
                    </div>
                    <div class="flat-details-header">
                        <h3><input type="text" class="property-name-input" placeholder="Enter Flat Name" value="${property.name || ''}" disabled></h3>
                    </div>
                    <div class="property-details-row">
                        <div class="property-info">
                            <div class="property-info-field">
                                <strong>Location:</strong>
                                <input type="text" class="property-location-input" placeholder="Enter Location" value="${property.location || ''}" disabled>
                            </div>
                            <div class="property-info-field">
                                <strong>Number of bedrooms:</strong>
                                <input type="number" class="property-bedrooms-input" placeholder="Enter number of bedrooms" value="${property.bedrooms || ''}" disabled>
                            </div>
                            <div class="property-info-field">
                                <strong>Additional Details:</strong>
                                <input type="text" class="property-additional-input" placeholder="Enter Details" value="${property.additionalDetails || ''}" disabled>
                            </div>
                            <div class="property-info-field">
                                <strong>Address:</strong>
                                <input type="text" class="property-address-input" placeholder="Enter Address" value="${property.address || ''}" disabled>
                            </div>
                            <div class="property-info-field">
                                <strong>Date of purchase:</strong>
                                <input type="date" class="property-purchase-date-input" placeholder="Enter Date" value="${property.purchaseDate ? new Date(property.purchaseDate).toISOString().split('T')[0] : ''}" disabled>
                            </div>
                            <div class="property-info-field">
                                <strong>Price when purchased:</strong>
                                <input type="number" class="property-purchase-price-input" placeholder="Enter Price" value="${property.purchasePrice || ''}" disabled>
                            </div>
                        </div>
                    </div>

                    <ul class="property-sub-nav">
                        <li><a href="#" class="sub-nav-link active" data-sub-target="gallery">Gallery</a></li>
                        <li><a href="#" class="sub-nav-link" data-sub-target="legal-details">Legal Details</a></li>
                        <li><a href="#" class="sub-nav-link" data-sub-target="suggested-services">Suggestions & Advice</a></li>
                        <div class="sub-active-line"></div>
                    </ul>

                    <div class="property-details-content sub-active" data-sub-content="gallery">
                        <div class="file-upload-container">
                             <p>Add Property Photos (JPEG, PNG):</p>
                             <label for="property-photo-upload-${property._id}" class="upload-label">
                                 <input type="file" id="property-photo-upload-${property._id}" class="property-photo-upload" accept="image/jpeg, image/png" multiple style="display: none;">
                                 <span>Click to Add Photos</span>
                             </label>
                             <div class="uploaded-photos"></div>
                        </div>
                    </div>
                    <div class="property-details-content" data-sub-content="legal-details">
                        <div class="file-upload-container">
                            <p>Add Legal Documents (PDF, DOCX):</p>
                             <label for="legal-doc-upload-${property._id}" class="upload-label">
                                <input type="file" id="legal-doc-upload-${property._id}" class="legal-doc-upload" accept=".pdf, .docx" multiple style="display: none;">
                                <span>Click to Add Documents</span>
                            </label>
                            <div class="uploaded-docs"></div>
                        </div>
                    </div>
                    <div class="property-details-content" data-sub-content="suggested-services">
                        <h3>Your Suggestions</h3>
                        <p>Add your own notes here:</p>
                        <textarea class="suggestions-text" placeholder="Start typing..." disabled>${property.suggestions || ''}</textarea>
                        <h3>Expert Advice</h3>
                        <p>Add notes or advice from your real estate agent or expert here:</p>
                        <textarea class="expert-advice-text" placeholder="Start typing..." disabled>${property.expertAdvice || ''}</textarea>
                    </div>
                </div>
            `;
            // --- End of HTML templates ---

            // --- Profile picture editing logic ---
            const profilePicEditBtn = document.querySelector('.profile-pic-edit-btn');
            const profilePicFields = document.querySelector('.profile-pic-fields');
            const profilePhotoUpload = document.getElementById('profile-photo-upload');
            const saveProfilePicBtn = document.getElementById('save-profile-pic-btn');
            const profilePic = document.getElementById('profile-pic');
            
            profilePicEditBtn.addEventListener('click', () => {
                profilePicFields.style.display = 'block';
            });

            profilePhotoUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profilePic.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

            saveProfilePicBtn.addEventListener('click', async () => {
                const newPhotoUrl = profilePic.src;
                // You will need to create a new API route in server.js to handle this save.
                // For now, this is a placeholder to show the front-end logic.
                alert('Profile picture saved! (Note: backend for this feature is not yet implemented.)');
                profilePicFields.style.display = 'none';
            });
            
            // --- Core function to enable/disable input fields for editing ---
            const toggleEditMode = (cardElement, enable) => {
                const inputs = cardElement.querySelectorAll('input:not([type="file"]), textarea');
                const saveButton = cardElement.querySelector('.save-btn');
                const fileUploadContainers = cardElement.querySelectorAll('.file-upload-container');

                inputs.forEach(input => {
                    input.disabled = !enable;
                    input.classList.toggle('editable', enable);
                });
                
                fileUploadContainers.forEach(container => {
                    container.classList.toggle('editable', enable);
                });
                
                saveButton.classList.toggle('active', enable);
            };
            
            // --- Core function to add a property card to the DOM and attach event listeners ---
            const initializePropertyCard = (property, container) => {
                const cardHTML = property.type === 'plot' ? plotCardTemplate(property) : flatCardTemplate(property);
                container.insertAdjacentHTML('beforeend', cardHTML);
                const cardElement = container.lastElementChild;
                
                // Add an event listener to the edit button
                const editBtn = cardElement.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    toggleEditMode(cardElement, true);
                });

                // Add an event listener to the save button
                const saveBtn = cardElement.querySelector('.save-btn');
                saveBtn.addEventListener('click', async () => {
                    const id = cardElement.dataset.id;
                    const updates = {};
                    
                    // Collect all input values
                    const inputs = cardElement.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        let key = input.className.split('-')[1];
                        if (key === 'sqyards') key = 'sqYards';
                        if (key === 'bedrooms') key = 'bedrooms';
                        if (key === 'additional') key = 'additionalDetails';
                        if (key === 'purchase') key = 'purchaseDate';
                        if (key === 'price') key = 'purchasePrice';
                        if (key === 'suggestions') key = 'suggestions';
                        if (key === 'expert') key = 'expertAdvice';
                        updates[key] = input.value;
                    });
                    
                    // Get photos and docs from the DOM
                    const photoElements = cardElement.querySelectorAll('.uploaded-photos img');
                    updates.photos = Array.from(photoElements).map(img => img.src);
                    const docElements = cardElement.querySelectorAll('.uploaded-docs div.uploaded-item');
                    updates.documents = Array.from(docElements).map(el => el.dataset.url);

                    try {
                        const response = await fetch(`/api/properties/${id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updates)
                        });
                        if (response.ok) {
                            alert('Property updated successfully! 🎉');
                            toggleEditMode(cardElement, false);
                        } else {
                            alert('Failed to save property. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error saving property:', error);
                        alert('Server error. Failed to save property.');
                    }
                });

                // Add an event listener to the delete button
                const deleteBtn = cardElement.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this property?')) {
                        const id = cardElement.dataset.id;
                        try {
                            const response = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
                            if (response.ok) {
                                cardElement.remove();
                                alert('Property deleted successfully! ✅');
                            } else {
                                alert('Failed to delete property.');
                            }
                        } catch (error) {
                            console.error('Error deleting property:', error);
                            alert('Server error. Failed to delete property.');
                        }
                    }
                });

                // Add event listeners for file uploads
                const photoUploadInput = cardElement.querySelector('.property-photo-upload');
                photoUploadInput.addEventListener('change', (e) => handleFileUpload(e, cardElement, 'photos'));

                const docUploadInput = cardElement.querySelector('.legal-doc-upload');
                docUploadInput.addEventListener('change', (e) => handleFileUpload(e, cardElement, 'documents'));

                // Handle sub-navigation
                const subNavLinks = cardElement.querySelectorAll('.sub-nav-link');
                const subContents = cardElement.querySelectorAll('.property-details-content');
                const subActiveLine = cardElement.querySelector('.sub-active-line');
                const subNavContainer = cardElement.querySelector('.property-sub-nav');

                const updateSubNavLine = (activeLink) => {
                    const linkRect = activeLink.getBoundingClientRect();
                    const navRect = subNavContainer.getBoundingClientRect();
                    subActiveLine.style.width = `${linkRect.width}px`;
                    subActiveLine.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
                };

                subNavLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        subNavLinks.forEach(l => l.classList.remove('active'));
                        subContents.forEach(c => c.classList.remove('sub-active'));
                        link.classList.add('active');
                        const target = cardElement.querySelector(`[data-sub-content="${link.dataset.subTarget}"]`);
                        if (target) {
                            target.classList.add('sub-active');
                        }
                        updateSubNavLine(link);
                    });
                });

                const initialSubLink = subNavLinks[0];
                if (initialSubLink) {
                    initialSubLink.classList.add('active');
                    setTimeout(() => updateSubNavLine(initialSubLink), 0);
                }

                // Render initial photos and documents
                const photoContainer = cardElement.querySelector('.uploaded-photos');
                property.photos.forEach(base64Data => addUploadedItem(base64Data, 'image', photoContainer, cardElement));

                const docContainer = cardElement.querySelector('.uploaded-docs');
                property.documents.forEach(base64Data => addUploadedItem(base64Data, 'document', docContainer, cardElement));
            };

            // --- Function to handle file uploads and convert to base64 ---
            const handleFileUpload = (event, cardElement, type) => {
                const files = event.target.files;
                if (!files.length) return;
                const container = cardElement.querySelector(type === 'photos' ? '.uploaded-photos' : '.uploaded-docs');

                Array.from(files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64Data = reader.result;
                        addUploadedItem(base64Data, type === 'photos' ? 'image' : 'document', container, cardElement);
                    };
                    reader.readAsDataURL(file);
                });
            };

            // --- Function to add uploaded item to the DOM ---
            const addUploadedItem = (base64Data, fileType, container, cardElement) => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('uploaded-item');
                itemDiv.dataset.url = base64Data;
                
                if (fileType === 'image') {
                    const img = document.createElement('img');
                    img.src = base64Data;
                    itemDiv.appendChild(img);
                } else {
                    const docIcon = document.createElement('span');
                    docIcon.innerHTML = '📄';
                    itemDiv.appendChild(docIcon);
                }

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'x';
                deleteBtn.classList.add('delete-file-btn');
                deleteBtn.addEventListener('click', () => {
                    itemDiv.remove();
                });
                itemDiv.appendChild(deleteBtn);
                container.appendChild(itemDiv);
            };

            // --- Add new property functionality (creates a new property in DB) ---
            const createNewProperty = async (type) => {
                const response = await fetch('/api/properties', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type })
                });
                if (response.ok) {
                    const newProperty = await response.json();
                    if (type === 'plot') {
                        initializePropertyCard(newProperty, plotListContainer);
                    } else {
                        initializePropertyCard(newProperty, flatListContainer);
                    }
                } else {
                    alert('Failed to create new property.');
                }
            };
            
            addNewPlotBtn.addEventListener('click', () => createNewProperty('plot'));
            addNewFlatBtn.addEventListener('click', () => createNewProperty('flat'));

            initialProperties.forEach(property => {
                if (property.type === 'plot') {
                    initializePropertyCard(property, plotListContainer);
                } else {
                    initializePropertyCard(property, flatListContainer);
                }
            });

            // --- Tabbed navigation logic ---
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navLinks.forEach(l => l.classList.remove('active'));
                    document.querySelectorAll('.content-section').forEach(c => c.classList.remove('active'));
                    
                    link.classList.add('active');
                    const targetId = link.dataset.target;
                    document.getElementById(targetId).classList.add('active');
                });
            });
        });
    </script>
</body>
</html>

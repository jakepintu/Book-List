// Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI Constructor
function UI() {};

// Add Book To List
UI.prototype.addBookToList = function(book) {
	const list = document.getElementById('book-list');
	// Create tr element
	const row = document.createElement('tr');
	// Insert cols
	row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="text-danger">X</a></td>
	`;

	list.appendChild(row);
}

// Show Alert
UI.prototype.showAlert = function(message, className) {
	// Create div
	const div = document.createElement('div');
	// Add Classes
	div.className = `alert ${className}`;
	// Add text
	div.appendChild(document.createTextNode(message));
	// Get Parent
	const form = document.getElementById('book-form');
	// Insert alert
	document.querySelector('.card').insertBefore(div, form);

	// Timeout after 3 sec
	setTimeout(function() {
		document.querySelector('.alert').remove();
	}, 3000)
}

// Delete Book
UI.prototype.deleteBook = function(target) {
	if(target.className === 'text-danger') {
		target.parentElement.parentElement.remove();
	}
}

// Clear Fields
UI.prototype.clearFields = function() {
	document.getElementById('title').value = '';
	document.getElementById('author').value = '';
	document.getElementById('isbn').value = '';
}

// Local Storage
function Store() {};

// getBooks from LS
Store.getBooks = function() {
	let books;
	if (localStorage.getItem('books') === null) {
		books = [];
	} else {
		books = JSON.parse(localStorage.getItem('books'));
	}

	return books;
}

// Display Books from LS
Store.displayBooks = function() {
	const books = Store.getBooks();

	books.forEach(book => {
		const ui = new UI;

		// Add Book to UI
		ui.addBookToList(book);
	});
}

// Add Books to LS
Store.addBooks = function(book) {
	const books = Store.getBooks();

	books.push(book);

	localStorage.setItem('books', JSON.stringify(books));
}

// Remove Books from LS
Store.removeBook = function(isbn) {
	const books = Store.getBooks();

	books.forEach((book, index) => {
		if(book.isbn === isbn) {
			books.splice(index, 1);
		}
	});

	localStorage.setItem('books', JSON.stringify(books));
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for Add Book
document.getElementById('book-form').addEventListener('submit',
    function(e) {
    	// Get form values
        const title = document.getElementById('title').value,
            author = document.getElementById('author').value,
            isbn = document.getElementById('isbn').value;

        // Instantiate book
        const book = new Book(title, author, isbn);

        // Instantiate UI
        const ui = new UI();

        // Validate
        if (title === '' || author === '' || isbn === '') {
        	// Error alert
        	ui.showAlert('Please fill in all fields', 'alert-danger');
        } else {
	        // Add book to list
	        ui.addBookToList(book);

	        // Add to LS
	        Store.addBooks(book);

	        // Clear fields
	        ui.clearFields();

	        // Success
        	ui.showAlert('Book Added!', 'alert-success');
        }


        e.preventDefault();
    });

// Event Listener for Delete
document.getElementById('book-list').addEventListener('click', 
	function(e) {
		// Instantiate UI
		const ui = new UI();

		ui.deleteBook(e.target);

		// Remove form LS
		Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

		// Show message
		ui.showAlert('Book Removed!', 'alert-success');

		e.preventDefault();
	});
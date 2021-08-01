const baseUrl = `https://api.nytimes.com/svc/books/v3`;
const apiKey = "0nG5do2caU59G7F2PT1eRQD0RAsaX5Du";

//Bazadan ma'lumot chaqirish
const getList = async () => {
    try {
        const res = await axios.get(`${baseUrl}/lists/names.json?api-key=${apiKey}`);
        console.log("oxshadi");
        return { success: true, data: res.data };
    } catch (error) {
        console.error("oxshamadi");
        return { success: false };

    }

}
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const list = document.getElementById('list');
let activeLink;

//chap tomonni chiqarish
const setList = async () => {
    list.innerHTML = "";
    loading.classList.remove("d-none");
    error.classList.add("d-none");
    list.classList.add("d-none");


    const res = await getList();
    loading.classList.add("d-none");

    if (res.success) {
        list.classList.remove("d-none");

        res.data.results.map((v, i) => {
            const div = document.createElement('div');
            div.href = `${v.list_name_encoded}`;
            div.className = `list - group`;
            div.onclick = (event) => {

                activeLink?.classList?.remove("active");
                event.target.classList.add("active");
                activeLink = event.target;
                setBooks(v.list_name_encoded);
            };
            div.innerHTML = `

            <a href="#" class="list-group-item list-group-item-action" aria-current="true">
            <p>${v.list_name}</p>
            <div class="d-flex justify-content-between ">
            <p class="fw-bold"><i class="far fa-calendar-alt"></i>${v.newest_published_date}</p>
            <p><span class="badge bg-warning text-dark">${v.updated}</span></p>
            </div>
        </a>

           `;
            list.appendChild(div);

        });

        setBooks(res.data.results[0].list_name_encoded);
        list.children[0].classList.add("active");
    }
    else {
        error.classList.remove("d-none");
    }
}

setList();

//O'ng tomonni bazadan chaqirish
const getBooks = async (list_name_encoded) => {
    console.log(list_name_encoded);

    try {
        const res = await axios.get(`${baseUrl}/lists/current/${list_name_encoded}.json?api-key=${apiKey}`);
        console.log("oxshadi");
        return { success: true, data: res.data };
    } catch (error) {
        console.error("oxshamadi");
        return { success: false };

    }

};
//Aboute ichidagi internetga ulangan linklar
const getBuyLinks = (links) => {
    let strLinks = ``;
    links.map((v, i) => {
        strLinks += `
        <a  href="${v.url}" class="list-group-item">${v.name}</a>`
    });
    return strLinks;

}


const loading2 = document.getElementById('loading2');
const error2 = document.getElementById('error2');
const books = document.getElementById('books');

//bootstrap dan olingan modal
var myModal = new bootstrap.Modal(document.getElementById('productDetail'), {
    keyboard: false
});

//Modal ni ekranga chiqarish
const showDetail = (book_uri) => {
    console.log(book_uri);
    let selectedBook;
    for (let i = 0; i < booksArray.length; i++) {
        if (booksArray[i].book_uri == book_uri) {
            selectedBook = booksArray[i];
            break;
        }
    }
    console.log(selectedBook.title);
    modalBody.innerHTML = `
    <div class="row ">
    <div class="col-md-5 ">
        <img src="${selectedBook.book_image}"
            class="w-100 rounded" alt="rasm">
    </div>

    <div class="col-md-7">
        <h4 class="text-primary fw-bold">${selectedBook.title}</h4>
        <p class="text-secondary">Author: <span class=" text-dark fw-bold">${selectedBook.author}</span></p>
        <p class="text-secondary">${selectedBook.description}</p>
        <p>Publisher: Little, Brown"</p>
        <p>Price: <span class="text-success">${selectedBook.price}</span></p>
        <p>WEEKLY</p>
        <div class="d-flex">
            <p class="me-3">b.d: ${selectedBook.book_image_width}</p>
            <p> p.d: ${selectedBook.book_image_height}</p>
        </div>

    </div>
    <p class="text-danger">Buy links: </p>
    ${getBuyLinks(selectedBook.buy_links)}
    <div class="list-group d-flex flex-wrap buy-links list-group-horizontal">
      
    </div>
</div>
    `;
    myModal.show()
}
let booksArray;

//Input ga yozilgan ma'lumotni ekranga chiqarish
const mapBooks = (array, searchStr) => {
    searchStr = searchStr.toLowerCase();
    books.innerHTML = "";
    const filteredArrary = array.filter((v, i) => {
        const title = v.title.toLowerCase().indexOf(searchStr) != -1;
        const author = v.author.toLowerCase().indexOf(searchStr) != -1;
        return title || author;
    });
    filteredArrary.map((v, i) => {
        const book = document.createElement('div');
        book.className = `col-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-between`;
        book.innerHTML = `
        <div class="rounded p-3 shadow  h-100 d-flex justify-content-between flex-column jj">
        <img src="${v.book_image}" alt="" class="w-100">
        <p class="fw-b">${v.title}</p>
        <p class="text-secondary">${v.author}</p>
        <p>Price: <span class="text-success fw-bold">${v.price}</span></p>
        <div class="d-flex justify-content-between">
            <a href="${v.amazon_product_url}" class="btn btn-primary rounded m-2 w-50">Buy</a>
            <button onclick="showDetail('${v.book_uri}')"
            class="btn btn-warning m-2 w-50">Aboute</button>
            </div>
       `;
        books.appendChild(book);

    });
}
const modalBody = document.getElementById("modalBody");

//O'ng tarafni ekranga chiqarish
const setBooks = async (list_name_encoded) => {
    console.log(list_name_encoded);
    books.innerHTML = "";
    loading2.classList.remove("d-none");
    error2.classList.add("d-none");
    books.classList.add("d-none");

    const res = await getBooks(list_name_encoded);
    if (res.success) {
        booksArray = res.data.results.books;
        books.classList.remove("d-none");

        mapBooks(res.data.results.books, "");

    }
    else {
        error2.classList.remove("d-none");
    }
    loading2.classList.add("d-none");

}
setBooks();

const searchInput = document.getElementById("searchInput");

//qidirish

const search = () => {
    console.log(searchInput.value);
    mapBooks(booksArray, searchInput.value);
}
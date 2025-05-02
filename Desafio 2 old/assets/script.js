let guidesData;
let insurancesData;
let currentPage = 1;
const ITEM_PER_PAGE = 2;

const fetchGuides = async() => {
	const guidesResponse = await fetch('https://augustoferreira.com/augustoferreira/amigo/guides.json');
	guidesData = await guidesResponse.json();
	const insurancesResponse = await fetch('https://augustoferreira.com/augustoferreira/amigo/insurances.json');
	insurancesData = await insurancesResponse.json();
};

const fetchEndPoints = async () => {
	try {
		await fetchGuides();
		listItems(guidesData?.data?.guides);
		renderTable(guidesData?.data?.guides);
	} catch(error) {
		console.log('Erro ao buscar os dados:', error);
	}
}

function guideArrays(array, page_size, page_number) {
	return array.slice((page_number - 1) * page_size, page_number * page_size);
}

const listItems = (guides) => {
    const firstPage = document.querySelector('#first-page');
    const previousPage = document.querySelector('#previous-page');
    const nextPage = document.querySelector('#next-page');
    const lastPage = document.querySelector('#last-page');
    const pageItemParent = document.querySelector('#page-item-parent');

    const pageCount = Math.ceil(guides.length / ITEM_PER_PAGE); 
	const handlePageButtonsStatus = () => {
		if  (currentPage <= 0)return; 
		if (currentPage === 1) {
		previousPage.style.pointerEvents = 'none';
		previousPage.classList.add('disabled');
		firstPage.style.pointerEvents = 'none';
		firstPage.classList.add('disabled');
	} else {
		previousPage.style.pointerEvents = 'auto';
		previousPage.classList.remove('disabled');
		firstPage.style.pointerEvents = 'auto';
		firstPage.classList.remove('disabled');
	}

	if (currentPage === pageCount) {
		nextPage.style.pointerEvents = 'none';
		nextPage.classList.add('disabled');
		lastPage.style.pointerEvents = 'none';
		lastPage.classList.add('disabled');
	} else {
		nextPage.style.pointerEvents = 'auto';
		nextPage.classList.remove('disabled');
		lastPage.style.pointerEvents = 'auto';
		lastPage.classList.remove('disabled');
	}

	renderTable(guidesData?.data?.guides);
	};
	const setCurrentPage = (pageNum) => {
	currentPage = pageNum;
	console.log(currentPage);
	const pageItems = document.querySelectorAll('.page-link');
	pageItems.forEach((item, index) => {
	  if (index - 1 === pageNum) {
		item.classList.add('active');
	  } else {
		item.classList.remove('active');
	  }
	});
	handlePageButtonsStatus();
	
  };
  previousPage.classList.add('disabled');
  firstPage.classList.add('disabled');

  

	pageItemParent.innerHTML = ''; 

	for (let i = 1; i <= pageCount; i++) {
	  let item = document.createElement('li');
	  item.className = 'page-item'; 
	  let link = document.createElement('a');
	  link.className = 'page-link';
	  if(i === 1) link.classList.add('active');
	  link.textContent = i;
	  link.id = `page-item-${i}`;
	  link.setAttribute('aria-label', `Page ${i}`);
	  
	  link.addEventListener("click", () => setCurrentPage(i));
	
	  item.appendChild(link); 
	  pageItemParent.appendChild(item); 
	}

    firstPage.addEventListener("click", () => setCurrentPage(1));
    previousPage.addEventListener("click", () => setCurrentPage(currentPage - 1));
    nextPage.addEventListener("click", () => setCurrentPage(currentPage + 1));
    lastPage.addEventListener("click", () => setCurrentPage(pageCount));
};

const renderTable = async (guides, isSort) => {
	const table = document.querySelector("#tabela");

	let dataToRender = isSort ? guides : guideArrays(guides, ITEM_PER_PAGE, currentPage);

	table.innerHTML = '';

	if (!dataToRender.length) {
		table.innerHTML = `
			<tr>
				<td colspan="5" style="text-align: center;">Nenhuma guia encontrada</td>
			</tr>
		`;
		return;
	}

	dataToRender.forEach(guide => {
		const { number, start_date, patient, health_insurance, price } = guide;
		const formattedDate = new Date(start_date).toLocaleDateString('pt-BR');
		table.innerHTML += `
			<tr>
				<td>${formattedDate}</td>
				<td>${number || '-'}</td>
				<td>
					<div style="display: flex; align-items: center;">
						${`<img src="${patient?.thumb_url || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" }" alt="${patient?.name || '-'}" id="paciente-img">`}
						<span id="paciente-span">${patient?.name || '-'}</span>
					</div>
				</td>
				<td>${`<span id=${health_insurance?.is_deleted ? 'isTrue' : ''}>${health_insurance?.name || '-'}</span>`}</td>
				<td>R$ ${isNaN(price) || price == null ? '-' : price.toFixed(2)}</td>
			</tr>`;
	});
};

const selectInset = async() => {	
	await fetchEndPoints();
	
	let insurancesSelect = document.getElementById('covSelect');
	let allOption = document.createElement('option');

	insurancesSelect.innerHTML = ''; 
	allOption.id = 'selectConv';
	allOption.textContent = 'Convênio';
	allOption.value = null;
	insurancesSelect.appendChild(allOption);

	insurancesData?.data.forEach(el => {
		let item = document.createElement('option');
		item.id = 'selectConv';
		item.value = el.id;
		item.textContent = el.name;
		insurancesSelect.appendChild(item);
	});

	insurancesSelect.addEventListener('change', () => {
		filterGuides();
	});
}

selectInset();

const filterGuides = async() => {
	await fetchEndPoints();

	let guideChunks = guideArrays(guidesData.data.guides, ITEM_PER_PAGE, currentPage);

	const searchBar = document.getElementById('search').value;
	const convenioSelect = parseInt(document.getElementById('covSelect').value);
	const inputNormalizado = searchBar.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	
	const initialDate = document.getElementById('input-start-date').value;
	const finalDate = document.getElementById('input-final-date').value;

	const initialDateObj = new Date(initialDate).toISOString().split('T')[0];
	const finalDateObj = new Date(finalDate).toISOString().split('T')[0];

	if (!convenioSelect && !searchBar && !initialDateObj && !finalDateObj) {
		renderTable(guideChunks)
		return;
	}

	const filtroInput = guideChunks.filter(guide => {
		const nomeNormalizado = guide.patient?.name?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() || '';
		const convenioInputNormalizado = guide.health_insurance?.name?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() || '';

		const nomeFiltrado = nomeNormalizado.includes(inputNormalizado);
		const convenioInputFiltrado = convenioInputNormalizado.includes(inputNormalizado);

		const searchBarMatches = nomeFiltrado || convenioInputFiltrado;
		const convenioSelectMatches = convenioSelect === guide.health_insurance?.id;

		const guideStartDate = new Date(guide?.start_date).toISOString().split('T')[0];
		const dateMatches = guideStartDate >= initialDateObj && guideStartDate <= finalDateObj;
		
		if (searchBar && convenioSelect && initialDateObj) {
			return searchBarMatches && convenioSelectMatches && dateMatches;
		}

		if (searchBar && initialDateObj) {
			return searchBarMatches && dateMatches;
		}

		if(searchBar && convenioSelect){
			return searchBarMatches && convenioSelectMatches;
		}

		if(convenioSelect && initialDateObj){
			return convenioSelectMatches && dateMatches;
		}

		if (searchBar) {
			return searchBarMatches;
		}

		if (convenioSelect) {
			return convenioSelectMatches;
		}
		
		if (initialDateObj) {
			return dateMatches;
		}
	});

	renderTable(filtroInput, true);
}


const todayColor = document.querySelector('#today');
const monthColor = document.querySelector('#month');


function formatDate(date) {
	let day = date.getDate().toString().padStart(2, '0');
	let month = (date.getMonth() + 1).toString().padStart(2, '0');
	let year = date.getFullYear();
  
	return `${year}-${month}-${day}`;
}
  
let date = new Date();
let primeiroDia = new Date(date.getFullYear(), date.getMonth(), 1);
let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('input-start-date').value = formatDate(primeiroDia);
	document.getElementById('input-final-date').value = formatDate(ultimoDia);
});

const mes = () =>{
	document.getElementById('input-start-date').value = formatDate(primeiroDia);
	document.getElementById('input-final-date').value = formatDate(ultimoDia);

	filterGuides();
}
  
const hoje = () => {
	const date = new Date();
	let day = date.getDate().toString().padStart(2, '0');
	let month = (date.getMonth() + 1).toString().padStart(2, '0');
	let year = date.getFullYear();

	document.getElementById('input-start-date').value = `${year}-${month}-${day}`;
	document.getElementById('input-final-date').value = `${year}-${month}-${day}`;

	filterGuides();
};
	
document.querySelector('#input-start-date').addEventListener('change', () => {
});

const sortDate = async (buttonIcon) => {
	await fetchEndPoints();
	let guideChunks = guideArrays(guidesData.data.guides, ITEM_PER_PAGE, currentPage);

	if (buttonIcon.classList.contains('fa-sort-down')) {
		guideChunks.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
		buttonIcon.classList.remove('fa-sort-down');
		buttonIcon.classList.add('fa-sort-up');
	} else {
		guideChunks.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
		buttonIcon.classList.remove('fa-sort-up');
		buttonIcon.classList.add('fa-sort-down');
	}

	renderTable(guideChunks, true);
};
const sortName = async (buttonIcon) => {
	await fetchGuides();

	let guideChunks = guideArrays(guidesData.data.guides, ITEM_PER_PAGE, currentPage);

	if (buttonIcon.classList.contains('fa-sort-down')) {
		flag = false;
		guideChunks.sort((a, b) => a.patient?.name.localeCompare(b.patient?.name));
		buttonIcon.classList.remove('fa-sort-down');
		buttonIcon.classList.add('fa-sort-up');
	} else {
		guideChunks.sort((a, b) => b.patient?.name.localeCompare(a.patient?.name));
		buttonIcon.classList.remove('fa-sort-up');
		buttonIcon.classList.add('fa-sort-down');
	}

	renderTable(guideChunks, true);
};

const sortNumber = async (buttonIcon) => {
	await fetchEndPoints();

	let guideChunks = guideArrays(guidesData.data.guides, ITEM_PER_PAGE, currentPage);

	if (buttonIcon.classList.contains('fa-sort-down')) {
		guideChunks.sort((a, b) => (a?.number) - (b?.number));
		buttonIcon.classList.remove('fa-sort-down');
		buttonIcon.classList.add('fa-sort-up');
	} else {
		guideChunks.sort((a, b) => (b?.number) - (a?.number));
		buttonIcon.classList.remove('fa-sort-up');
		buttonIcon.classList.add('fa-sort-down');
	}

	renderTable(guideChunks, true);
};
const sortPrice = async (buttonIcon) => {
	await fetchEndPoints();

	let guideChunks = guideArrays(guidesData.data.guides, ITEM_PER_PAGE, currentPage);

	if (buttonIcon.classList.contains('fa-sort-down')) {
		guideChunks.sort((a, b) => (a?.price) - (b?.price));
		buttonIcon.classList.remove('fa-sort-down');
		buttonIcon.classList.add('fa-sort-up');
	} else {
		guideChunks.sort((a, b) => (b?.price) - (a?.price));
		buttonIcon.classList.remove('fa-sort-up');
		buttonIcon.classList.add('fa-sort-down');
	}

	renderTable(guideChunks, true);
};
const sortInsurance = async (buttonIcon) => {
	await fetchEndPoints();
	
	let guideChunks = guideArrays(guidesData.data.guides, ITEM_PER_PAGE, currentPage);

	if (buttonIcon.classList.contains('fa-sort-down')) {
		guideChunks.sort((a, b) => a.health_insurance?.name.localeCompare(b.health_insurance?.name));
		buttonIcon.classList.remove('fa-sort-down');
		buttonIcon.classList.add('fa-sort-up');
	} else {
		guideChunks.sort((a, b) => b.health_insurance?.name.localeCompare(a.health_insurance?.name));
		buttonIcon.classList.remove('fa-sort-up');
		buttonIcon.classList.add('fa-sort-down');
	}

	renderTable(guideChunks, true);
};

const mesButton = document.getElementById('month');
const hojeButton = document.getElementById('today');

function toggleButton(activeButton, inactiveButton) {
    activeButton.classList.add('btn-active');
    inactiveButton.classList.remove('btn-active');
}

mesButton.addEventListener('click', () => toggleButton(mesButton, hojeButton));
hojeButton.addEventListener('click', () => toggleButton(hojeButton, mesButton));

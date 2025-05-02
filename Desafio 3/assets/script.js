// - Quantidade de procedimentos agrupado por ID ok
// - Quantidade de procedimentos por group_key ok 
// - Quantidade de procedimentos por attendance_id ok
// - Quantidade de procedimentos por finance_id ok
// - Total produzido (price), total liquido (liquid_price), total recebido (received_value) e total não recebido (liquid_price - received_value) por procedure_id ok
// - Totais por data (dia / mes / ano) ok
// - Agrupar procedimentos por atendimento ok
// - Agrupar procedimentos por financeiro ok

// - Totais por tiss_type (tipo de guia) 



const objArray = {};
let guidesData;
let chartInstance;
let currentPagePrice = 1;
let currentPageNotReceived = 1;
let currentPageLiquidPrice = 1;
let currentPageReceivedValeu = 1;
let currentPageProcedureFinance = 1;
let currentPageProcedureAttendance = 1;

const fetchPoint = async () => {
  try {
    const guidesResponse = await fetch('./assets/dataGuides.json');
    guidesData = await guidesResponse.json();
  } catch (error) { 
    console.log('Erro ao buscar os dados:', error);
  }
};

const chartByKey = async (key) => {
    await fetchPoint();

    const groupedData = guidesData
        .filter(guide => guide[key] !== null && guide[key] !== undefined)
        .reduce((acc, value) => {
            let keyGroup = value[key];

            if (key === 'group_key') {
                const match = keyGroup.match(/IDX_\d+/); 
                keyGroup = match ? match[0] : keyGroup;
            }

            if (!keyGroup) return acc; 

            if (!acc[keyGroup]) {
                acc[keyGroup] = { count: 0 };
            }

            acc[keyGroup].count++;
        
            return acc;
        }, {});

    const dataMapping = Object.entries(groupedData)
        .filter(([key, value]) => value.count > 0)
        .map(([key, value]) => ({ id: key, ...value }));

    const ids = dataMapping.map(item => item.id);
    const counts = dataMapping.map(item => item.count);

    const colors = {
        procedure_id: {
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
        },
        finance_id: {
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
        },
        attendance_id: {
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
        },
        group_key: {
            backgroundColor: "rgba(104, 102, 205, 0.2)",
            borderColor: "rgba(104, 102, 205, 1)",
        },
        tiss_type: {
            backgroundColor: "rgba(173, 255, 47, 0.2)",
            borderColor: "rgba(173, 255, 47, 1)",
        },
    };

    const dataMappingKey = {
        [key]: counts,
    };
    const labelsMappingKey = {
        [key]: ids,
    };

    if (chartInstance) {
        chartInstance.data.datasets[0].data = dataMappingKey[key];
        chartInstance.data.labels = labelsMappingKey[key];
        chartInstance.data.datasets[0].label = key.replace(/_/g, " ").toUpperCase() + " EM DESTAQUES";
        chartInstance.data.datasets[0].backgroundColor = colors[key]?.backgroundColor || "rgba(0,0,0,0.2)";
        chartInstance.data.datasets[0].borderColor = colors[key]?.borderColor || "rgba(0,0,0,1)";

        chartInstance.update();
    }
};

const initializeChart = () => {
    const ctx = document.querySelector("canvas.chart").getContext("2d");
    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Selecione uma opção"],
            datasets: [
                {
                    label: "Selecione uma chave",
                    data: [],
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
};

const createChart = async () => {
    await fetchPoint();

    const groupedData = guidesData
    .filter(guide => guide.created_at !== null)
    .reduce((acc, value) => {
        const dateGroup = new Date(value.created_at);
        const day = dateGroup.getDate().toString().padStart(2, '0'); 
        const month = (dateGroup.getMonth() + 1).toString().padStart(2, '0'); 
        const year = dateGroup.getFullYear(); 
        const dateKey = `${day}/${month}/${year}`;

        if (!acc[dateKey]) {
            acc[dateKey] = { count: 0 };
        }

        acc[dateKey].count++;

        return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData).map(item => item.count);
    const ctx = document.getElementById('chart-line-2').getContext('2d');
    
    window.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Totais por Data',
                data: data,
                fill: false,
                borderColor: 'rgba(54, 162, 235, 1)',
                tension: 0.1,
                borderWidth: 2,
            }]
        },
    });
};

const groupDataByProcedureId = async () => {
    await fetchPoint();
    
    const groupedData = guidesData
    .filter(guide => guide['procedure_id'] !== null && guide['procedure_id'] !== undefined)
    .reduce((acc, value) => {
        const keyGroup = value['procedure_id']; 
        
        if (!acc[keyGroup]) {
            acc[keyGroup] = { count: 0, not_recived: 0, received_value: 0, price: 0, liquid_price: 0};
        }
        
        acc[keyGroup].count++;
        const liquidPrice = Number(acc[keyGroup].liquid_price) || 0;
        const receivedValue = Number(acc[keyGroup].received_value) || 0;
        acc[keyGroup].not_recived = liquidPrice - receivedValue;
        acc[keyGroup].received_value += value?.received_value || 0;
        acc[keyGroup].price += value?.price || 0;
        acc[keyGroup].liquid_price += value?.liquid_price || 0;
        
        return acc;
    }, {});
    
    return groupedData;
}

const concatGroup = async () => {
    await fetchPoint();
    
    const groupedData = guidesData
    .filter(guide => guide['procedure_id'] !== null && guide['procedure_id'] !== undefined)
    .reduce((acc, value) => {
        const keyGroup = value['procedure_id']; 

        if (!acc[keyGroup]) {
            acc[keyGroup] = {
                procedure_attendance: { count: 0, values: [] },
                procedure_finance: { count: 0, values: [] },
                combined_attendace: {},
                combined_finance: {}
            };
        }
        const attendance = value['attendance_id'] ? `${keyGroup}_${value['attendance_id']}` : null;
        const finance = value['finance_id'] ? `${keyGroup}_${value['finance_id']}` : null;

        if (attendance) {
            acc[keyGroup].procedure_attendance.count++;
            acc[keyGroup].procedure_attendance.values.push(attendance);
            acc[keyGroup].combined_attendace[attendance] = (acc[keyGroup].combined_attendace[attendance] || 0) + 1;
        }
        if (finance) {
            acc[keyGroup].procedure_finance.count++;
            acc[keyGroup].procedure_finance.values.push(finance);
            acc[keyGroup].combined_finance[finance] = (acc[keyGroup].combined_finance[finance] || 0) + 1;
        }

        return acc;
    }, {});

    return groupedData;
}

function guideArrays(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

const nextPagePrice = async() => {
    const groupedData = await groupDataByProcedureId();

    const totalPages = Math.ceil(Object.entries(groupedData).length);
    if(currentPagePrice < totalPages){
        currentPagePrice++;
        updateCarouselPrice();
    }
};

const prevPagePrice = () => {
    if (currentPagePrice > 1) {
        currentPagePrice--;
        updateCarouselPrice();
    }
};

const updateCarouselPrice = async () => {
    const groupedData = await groupDataByProcedureId();
    
    const itemsPrice = Object.entries(groupedData)
    .sort(([, a], [, b]) => b.price - a.price)
    .map(([key, value]) => ({
        key,
        price: value.price,
        count: value.count
    }));
    
    const itemsArraysPrice = guideArrays(itemsPrice, 1,currentPagePrice);
    const carouselItemsPrice = document.querySelector('#carouselPrice');
    
    carouselItemsPrice.innerHTML = '';
    itemsArraysPrice.forEach((item) => {
        const { key, price, count } = item;
        carouselItemsPrice.innerHTML += `
        <div class="card p-4">
        <h5>Total Produzido ID: ${key}</h5>
        <h2 id="number-price">R$${isNaN(price) || price == null ? '-' : price.toFixed(2)}</h2>
        <p class="${count >= 10 ? 'text-success' : 'text-danger'}">Este elemento se repete ${count}x</p>
        
        
        <button class="carousel-control-prev" type="button" data-bs-target="#cardCarousel" data-bs-slide="prev" onclick="prevPagePrice()">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#cardCarousel" data-bs-slide="next" onclick="nextPagePrice()">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
        </button>
        </div>
        `;
    });
};

const nextPageLiquidPrice = async() => {
    const groupedData = await groupDataByProcedureId();
    const totalPages = Math.ceil(Object.entries(groupedData).length);
    if(currentPageLiquidPrice < totalPages){
        currentPageLiquidPrice++;
        updateCarouselLiquidPrice();
    }
};

const prevPageLiquidPrice = () => {
    if (currentPageLiquidPrice > 1) {
        currentPageLiquidPrice--;
        updateCarouselLiquidPrice();
    }
};

const updateCarouselLiquidPrice = async () => {
    const groupedData = await groupDataByProcedureId();
    
    const itemsLiquidPrice = Object.entries(groupedData)
    .sort(([, a], [, b]) => b.liquid_price - a.liquid_price)
    .map(([key, value]) => ({
        key,
        liquid_price: value.liquid_price,
        count: value.count
    }));
    
    const itemsArraysLiquidPrice = guideArrays(itemsLiquidPrice, 1, currentPageLiquidPrice);
    
    const carouselItemsLiquidPrice = document.querySelector('#carouselLiquidPrice');
    
    carouselItemsLiquidPrice.innerHTML = '';
    
    itemsArraysLiquidPrice.forEach((item) => {
        const { key, liquid_price, count } = item;
        carouselItemsLiquidPrice.innerHTML += `
        <div class="card p-4">
        <h5>Total Produzido ID: ${key}</h5>
        <h2 id="number-liquid-price">R$${isNaN(liquid_price) || liquid_price == null ? '-' : liquid_price.toFixed(2)}</h2>
        <p class="${count >= 10 ? 'text-success' : 'text-danger'}">Este elemento se repete ${count}x</p>
        
        <button class="carousel-control-prev" type="button" data-bs-target="#cardCarousel" data-bs-slide="prev" onclick="prevPageLiquidPrice()">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#cardCarousel" data-bs-slide="next" onclick="nextPageLiquidPrice()">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
        </button>
        </div>
        `;
    });
};

const nextPageReceivedValue = async() => {
    const groupedData = await groupDataByProcedureId();
    const totalPages = Math.ceil(Object.entries(groupedData).length);
    if(currentPageReceivedValeu < totalPages){
        currentPageReceivedValeu++;
        updateCarouselReceivedValue();
    }   
};

const prevPageReceivedValue = () => {
    if (currentPageReceivedValeu > 1) {
        currentPageReceivedValeu--;
        updateCarouselReceivedValue();
    }
};

const updateCarouselReceivedValue = async () => {
    const groupedData = await groupDataByProcedureId();
    const itemsReceivedValue  = Object.entries(groupedData)
    .sort(([, a], [, b]) => b.received_value - a.received_value)
    .map(([key, value]) => ({
        key,
        received_value: value.received_value,
        count: value.count
    }));
    
    const itemsArraysReceivedValue = guideArrays(itemsReceivedValue, 1, currentPageReceivedValeu);
    
    const carouselItemsPrice = document.querySelector('#carouselReceivedValue');
    
    carouselItemsPrice.innerHTML = '';
    itemsArraysReceivedValue.forEach((item) => {
        const { key, received_value, count } = item;
        carouselItemsPrice.innerHTML += `
        <div class="card p-4">
        <h5>Total Produzido ID: ${key}</h5>
        <h2 id="numberPrice">R$${isNaN(received_value) || received_value == null ? '-' : received_value.toFixed(2)}</h2>
        <p class="${count >= 10 ? 'text-success' : 'text-danger'}">Este elemento se repete ${count}x</p>
        
        <button class="carousel-control-prev" type="button" data-bs-target="#cardCarousel" data-bs-slide="prev" onclick="prevPageReceivedValue()">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#cardCarousel" data-bs-slide="next" onclick="nextPageReceivedValue()">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
        </button>
        </div>
        `;
    });
};

const nextPageNotReceived = async() => {
    const groupedData = await groupDataByProcedureId();
    const totalPages = Math.ceil(Object.entries(groupedData).length);
    if(currentPageNotReceived < totalPages){
        currentPageNotReceived++;
        updateCarouselNotReceived();
    }
};

const prevPageNotReceived = () => {
    if (currentPageNotReceived > 1) {
        currentPageNotReceived--;
        updateCarouselNotReceived();
    }
};

const updateCarouselNotReceived = async () => {
    const groupedData = await groupDataByProcedureId();
    const items = Object.entries(groupedData)
    .sort(([, a], [, b]) => b.not_recived - a.received_value)
    .map(([key, value]) => ({
        key,
        not_recived: value.not_recived,
        count: value.count
    }));
    
    const itemsArrays = guideArrays(items, 1, currentPageNotReceived);
    
    const carouselItemsPrice = document.querySelector('#carouselNotReceived');
    
    carouselItemsPrice.innerHTML = '';
    itemsArrays.forEach((item) => {
        const { key, not_recived, count } = item;
        carouselItemsPrice.innerHTML += `
        <div class="card p-4">
        <h5>Total Produzido ID: ${key}</h5>
        <h2 id="numberPrice">R$${isNaN(not_recived) || not_recived == null ? '-' : not_recived.toFixed(2)}</h2>
        <p class="${count >= 10 ? 'text-success' : 'text-danger'}">Este elemento se repete ${count}x</p>
        
        <button class="carousel-control-prev" type="button" data-bs-target="#cardCarousel" data-bs-slide="prev" onclick="prevPageNotReceived()">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#cardCarousel" data-bs-slide="next" onclick="nextPageNotReceived()">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
        </button>
        </div>
        `;
    });
};

const nextPageProcedureFinance = async() => {
    const groupedData = await groupDataByProcedureId();
    const totalPages = Math.ceil(Object.entries(groupedData).length);
    if(currentPageProcedureFinance < totalPages){
        currentPageProcedureFinance++;
        updateCarouselProcedureFinance();
    }
};

const prevPageProcedureFinance = () => {
    if (currentPageProcedureFinance > 1) {
        currentPageProcedureFinance--;
        updateCarouselProcedureFinance();
    }
};

const updateCarouselProcedureFinance= async () => {
    const groupedData = await concatGroup();

    const items = Object.entries(groupedData).map(([key, value]) => {
        const itemsCombined = Object.entries(value.combined_finance)
            .sort(([keyA, a], [keyB, b]) => b - a)
            .map(([combination, count]) => ({combination, count}));
        return {key, itemsCombined};
    });
    
    const allItems = items.flatMap(item => item.itemsCombined);
    const paginatedItems = guideArrays(allItems, 1, currentPageProcedureFinance);

    const carouselItemsProcedureFinance = document.querySelector('#carouselProcedureFinance');
    
    let carouselHTML = '';
    paginatedItems.forEach((item) => {
        const { key, combination, count } = item;
        carouselHTML += `
            <div class="card p-4">
                <h5>Procedure e Finance</h5>
                <h2 id="numberPrice">${combination ? combination : '-'}</h2>
                <p class="${count > 1 ? 'text-success' : 'text-danger'}">Este elemento se repete ${count}x</p>
    
                <button class="carousel-control-prev" type="button" data-bs-target="#cardCarousel" data-bs-slide="prev" onclick="prevPageProcedureFinance()">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#cardCarousel" data-bs-slide="next" onclick="nextPageProcedureFinance()">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `;
    });
    carouselItemsProcedureFinance.innerHTML = carouselHTML;
};

const nextPageProcedureAttendance = async() => {
    const groupedData = await concatGroup();
    const totalPages = Math.ceil(Object.entries(groupedData).length);
    if(currentPageProcedureAttendance < totalPages){
        currentPageProcedureAttendance++;
        updateCarouselProcedureAttendance();
    }
};

const prevPageProcedureAttendance = () => {
    if (currentPageProcedureAttendance > 1) {
        currentPageProcedureAttendance--;
        updateCarouselProcedureAttendance();
    }
};

const updateCarouselProcedureAttendance = async () => {
    const groupedData = await concatGroup();

    const items = Object.entries(groupedData).map(([key, value]) => {
        const itemsCombined = Object.entries(value.combined_attendace)
            .sort(([keyA, a], [keyB, b]) => b - a)
            .map(([combination, count]) => ({combination, count}));
        return {key, itemsCombined};
    });
    
    const allItems = items.flatMap(item => item.itemsCombined);
    const paginatedItems = guideArrays(allItems, 1, currentPageProcedureAttendance);

    const carouselItemsProcedureAttendace = document.querySelector('#carouselProcedureAttendance');
    
    let carouselHTML = '';
    paginatedItems.forEach((item) => {
        const { key, combination, count } = item;
        carouselHTML += `
            <div class="card p-4">
                <h5>Procedure e Attendance</h5>
                <h2 id="numberPrice">${combination ? combination : '-'}</h2>
                <p class="${count > 1 ? 'text-success' : 'text-danger'}">Este elemento se repete ${count}x</p>
    
                <button class="carousel-control-prev" type="button" data-bs-target="#cardCarousel" data-bs-slide="prev" onclick="prevPageProcedureAttendance()">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#cardCarousel" data-bs-slide="next" onclick="nextPageProcedureAttendance()">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `;
    });
    carouselItemsProcedureAttendace.innerHTML = carouselHTML;
};



document.addEventListener("DOMContentLoaded", async () => {
    await fetchPoint();
    
    document.getElementById("P_SELECT").addEventListener("change", (e) => {
        const selectedKey = e.target.value;
        if (selectedKey !== "0") {
            chartByKey(selectedKey);
        }
    });
});

initializeChart();
updateCarouselPrice();
updateCarouselLiquidPrice();
updateCarouselReceivedValue();
updateCarouselNotReceived();
createChart();
updateCarouselProcedureAttendance();
updateCarouselProcedureFinance();

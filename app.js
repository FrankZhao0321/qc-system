let devices = [];
let currentDeviceId = null;
let currentShippingId = null;

const statusMap = {
    assembling: { text: '组装中', class: 'badge-blue' },
    testing: { text: '测试中', class: 'badge-orange' },
    shipping: { text: '待发货', class: 'badge-green' },
    shipped: { text: '已发货', class: 'badge-purple' }
};

const itemTypeMap = {
    tool: { text: '刀具', class: 'badge-blue' },
    accessory: { text: '附件', class: 'badge-green' },
    other: { text: '其他', class: 'badge-purple' }
};

const feedbackTypeMap = {
    quality: { text: '质量问题', class: 'badge-error' },
    performance: { text: '性能问题', class: 'badge-warning' },
    service: { text: '服务问题', class: 'badge-blue' },
    suggestion: { text: '改进建议', class: 'badge-success' }
};

const priorityMap = {
    high: { text: '高', class: 'badge-error' },
    medium: { text: '中', class: 'badge-warning' },
    low: { text: '低', class: 'badge-success' }
};

function init() {
    loadData();
    if (devices.length === 0) {
        loadSampleData();
    }
    renderDeviceList();
}

function loadData() {
    const stored = localStorage.getItem('qcDevices');
    if (stored) {
        devices = JSON.parse(stored);
    }
}

function saveData() {
    localStorage.setItem('qcDevices', JSON.stringify(devices));
}

function loadSampleData() {
    devices = [
        {
            id: 1,
            device_number: 'CNC-2024-001',
            model: 'XK7132',
            customer: '华东机械制造有限公司',
            order_number: 'ORDER-2024-001',
            status: 'assembling',
            created_at: new Date().toISOString(),
            assemblyChecks: [
                {
                    id: 1,
                    check_item: '主轴安装精度',
                    description: '主轴与工作台垂直度检查，要求≤0.01mm/300mm',
                    inspector: '张工',
                    status: 'passed',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    check_item: '导轨平行度',
                    description: 'X轴导轨平行度检查，要求≤0.015mm/1000mm',
                    inspector: '李工',
                    status: 'passed',
                    created_at: new Date().toISOString()
                }
            ],
            testReports: [],
            shippingChecks: [],
            feedback: [],
            suggestions: []
        },
        {
            id: 2,
            device_number: 'CNC-2024-002',
            model: 'XK7140',
            customer: '北方精密仪器厂',
            order_number: 'ORDER-2024-002',
            status: 'testing',
            created_at: new Date().toISOString(),
            assemblyChecks: [
                {
                    id: 1,
                    check_item: '主轴安装精度',
                    description: '主轴与工作台垂直度检查，要求≤0.01mm/300mm',
                    inspector: '赵工',
                    status: 'passed',
                    created_at: new Date().toISOString()
                }
            ],
            testReports: [
                {
                    id: 1,
                    test_item: '定位精度测试',
                    standard: '±0.01mm',
                    result: 'pass',
                    tester: '测试员A',
                    test_date: new Date().toISOString(),
                    confirmed: true
                },
                {
                    id: 2,
                    test_item: '重复定位精度测试',
                    standard: '±0.005mm',
                    result: 'pass',
                    tester: '测试员A',
                    test_date: new Date().toISOString(),
                    confirmed: false
                }
            ],
            shippingChecks: [],
            feedback: [],
            suggestions: []
        },
        {
            id: 3,
            device_number: 'CNC-2024-003',
            model: 'XK7132',
            customer: '南方汽车零部件公司',
            order_number: 'ORDER-2024-003',
            status: 'shipping',
            created_at: new Date().toISOString(),
            assemblyChecks: [],
            testReports: [],
            shippingChecks: [
                {
                    id: 1,
                    item_name: 'φ10mm立铣刀',
                    item_type: 'tool',
                    required_quantity: 5,
                    actual_quantity: 5,
                    checker: '仓管员A',
                    status: 'matched',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    item_name: '夹具套装',
                    item_type: 'accessory',
                    required_quantity: 2,
                    actual_quantity: 2,
                    checker: '仓管员B',
                    status: 'matched',
                    created_at: new Date().toISOString()
                }
            ],
            feedback: [
                {
                    id: 1,
                    feedback_type: 'quality',
                    description: '设备运行稳定，精度满足要求',
                    rating: 5,
                    customer: '南方汽车零部件公司',
                    created_at: new Date().toISOString()
                }
            ],
            suggestions: [
                {
                    id: 1,
                    suggestion: '建议增加自动润滑系统的监控报警功能',
                    priority: 'medium',
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            ]
        }
    ];
    saveData();
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
    
    document.getElementById('page-' + pageId).classList.add('active');
    event.target.classList.add('active');
    
    if (pageId === 'devices') {
        renderDeviceList();
    }
}

function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function renderDeviceList() {
    const tbody = document.getElementById('deviceTableBody');
    tbody.innerHTML = devices.map(device => `
        <tr>
            <td>${device.device_number}</td>
            <td>${device.model}</td>
            <td>${device.customer}</td>
            <td>${device.order_number}</td>
            <td><span class="badge ${statusMap[device.status].class}">${statusMap[device.status].text}</span></td>
            <td>
                <button class="btn btn-sm" onclick="viewDevice(${device.id})">查看</button>
            </td>
        </tr>
    `).join('');
}

function viewDevice(id) {
    currentDeviceId = id;
    const device = devices.find(d => d.id === id);
    
    document.getElementById('deviceInfo').innerHTML = `
        <div class="info-item">
            <div class="info-label">设备编号</div>
            <div class="info-value">${device.device_number}</div>
        </div>
        <div class="info-item">
            <div class="info-label">型号</div>
            <div class="info-value">${device.model}</div>
        </div>
        <div class="info-item">
            <div class="info-label">客户</div>
            <div class="info-value">${device.customer}</div>
        </div>
        <div class="info-item">
            <div class="info-label">订单号</div>
            <div class="info-value">${device.order_number}</div>
        </div>
        <div class="info-item">
            <div class="info-label">状态</div>
            <div class="info-value"><span class="badge ${statusMap[device.status].class}">${statusMap[device.status].text}</span></div>
        </div>
        <div class="info-item">
            <div class="info-label">创建时间</div>
            <div class="info-value">${new Date(device.created_at).toLocaleString('zh-CN')}</div>
        </div>
    `;
    
    renderAssemblyChecks(device);
    renderTestReports(device);
    renderShippingChecks(device);
    renderStatusActions(device);
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('page-detail').classList.add('active');
}

function createDevice() {
    const deviceNumber = document.getElementById('deviceNumber').value;
    const model = document.getElementById('deviceModel').value;
    const customer = document.getElementById('deviceCustomer').value;
    const orderNumber = document.getElementById('deviceOrder').value;
    
    if (!deviceNumber || !model || !customer || !orderNumber) {
        alert('请填写完整信息');
        return;
    }
    
    const newDevice = {
        id: Date.now(),
        device_number: deviceNumber,
        model: model,
        customer: customer,
        order_number: orderNumber,
        status: 'assembling',
        created_at: new Date().toISOString(),
        assemblyChecks: [],
        testReports: [],
        shippingChecks: [],
        feedback: [],
        suggestions: []
    };
    
    devices.push(newDevice);
    saveData();
    renderDeviceList();
    hideModal('deviceModal');
    
    document.getElementById('deviceNumber').value = '';
    document.getElementById('deviceModel').value = '';
    document.getElementById('deviceCustomer').value = '';
    document.getElementById('deviceOrder').value = '';
    
    alert('设备创建成功');
}

function renderAssemblyChecks(device) {
    const tbody = document.getElementById('assemblyTableBody');
    if (device.assemblyChecks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">暂无检测记录</td></tr>';
        return;
    }
    
    tbody.innerHTML = device.assemblyChecks.map(check => `
        <tr>
            <td>${check.check_item}</td>
            <td>${check.description}</td>
            <td>${check.inspector}</td>
            <td>
                <span class="badge ${check.status === 'passed' ? 'badge-success' : check.status === 'failed' ? 'badge-error' : 'badge-blue'}">
                    ${check.status === 'passed' ? '合格' : check.status === 'failed' ? '不合格' : '待检测'}
                </span>
            </td>
            <td>
                ${check.status === 'pending' ? `
                    <button class="btn btn-sm btn-success" onclick="updateAssemblyStatus(${check.id}, 'passed')">合格</button>
                    <button class="btn btn-sm btn-danger" onclick="updateAssemblyStatus(${check.id}, 'failed')">不合格</button>
                ` : '-'}
            </td>
        </tr>
    `).join('');
}

function createAssemblyCheck() {
    const device = devices.find(d => d.id === currentDeviceId);
    const checkItem = document.getElementById('assemblyItem').value;
    const desc = document.getElementById('assemblyDesc').value;
    const inspector = document.getElementById('assemblyInspector').value;
    
    if (!checkItem || !desc || !inspector) {
        alert('请填写完整信息');
        return;
    }
    
    device.assemblyChecks.push({
        id: Date.now(),
        check_item: checkItem,
        description: desc,
        inspector: inspector,
        status: 'pending',
        created_at: new Date().toISOString()
    });
    
    saveData();
    renderAssemblyChecks(device);
    hideModal('assemblyModal');
    
    document.getElementById('assemblyItem').value = '';
    document.getElementById('assemblyDesc').value = '';
    document.getElementById('assemblyInspector').value = '';
    
    alert('检测项添加成功');
}

function updateAssemblyStatus(checkId, status) {
    const device = devices.find(d => d.id === currentDeviceId);
    const check = device.assemblyChecks.find(c => c.id === checkId);
    check.status = status;
    saveData();
    renderAssemblyChecks(device);
}

function renderTestReports(device) {
    const tbody = document.getElementById('testTableBody');
    if (device.testReports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">暂无测试记录</td></tr>';
        return;
    }
    
    tbody.innerHTML = device.testReports.map(report => `
        <tr>
            <td>${report.test_item}</td>
            <td>${report.standard}</td>
            <td>
                <span class="badge ${report.result === 'pass' ? 'badge-success' : 'badge-error'}">
                    ${report.result === 'pass' ? '通过' : '不通过'}
                </span>
            </td>
            <td>${report.tester}</td>
            <td>
                ${report.confirmed === true ? '<span class="badge badge-success">已确认</span>' : 
                  report.confirmed === false ? '<span class="badge badge-error">已确认不通过</span>' : 
                  '<span class="badge badge-blue">待确认</span>'}
            </td>
            <td>
                ${report.confirmed === null ? `<button class="btn btn-sm" onclick="confirmTestReport(${report.id})">确认</button>` : '-'}
            </td>
        </tr>
    `).join('');
}

function createTestReport() {
    const device = devices.find(d => d.id === currentDeviceId);
    const testItem = document.getElementById('testItem').value;
    const standard = document.getElementById('testStandard').value;
    const result = document.getElementById('testResult').value;
    const tester = document.getElementById('testTester').value;
    
    if (!testItem || !standard || !tester) {
        alert('请填写完整信息');
        return;
    }
    
    device.testReports.push({
        id: Date.now(),
        test_item: testItem,
        standard: standard,
        result: result,
        tester: tester,
        test_date: new Date().toISOString(),
        confirmed: null
    });
    
    saveData();
    renderTestReports(device);
    hideModal('testModal');
    
    document.getElementById('testItem').value = '';
    document.getElementById('testStandard').value = '';
    document.getElementById('testTester').value = '';
    
    alert('测试报告添加成功');
}

function confirmTestReport(reportId) {
    const device = devices.find(d => d.id === currentDeviceId);
    const report = device.testReports.find(r => r.id === reportId);
    const confirmed = confirm(`确认测试项目：${report.test_item}\n检测结果：${report.result === 'pass' ? '通过' : '不通过'}\n\n点击"确定"确认通过，点击"取消"确认不通过`);
    report.confirmed = confirmed;
    saveData();
    renderTestReports(device);
}

function renderShippingChecks(device) {
    const tbody = document.getElementById('shippingTableBody');
    const statsDiv = document.getElementById('shippingStats');
    
    const totalCount = device.shippingChecks.length;
    const checkedCount = device.shippingChecks.filter(c => c.actual_quantity !== null).length;
    const matchedCount = device.shippingChecks.filter(c => c.status === 'matched').length;
    
    statsDiv.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${totalCount}</div>
            <div class="stat-label">总项目数</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${checkedCount}</div>
            <div class="stat-label">已清点</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #52c41a;">${matchedCount}</div>
            <div class="stat-label">数量一致</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: ${totalCount > 0 && matchedCount === totalCount ? '#52c41a' : '#ff4d4f'};">
                ${totalCount > 0 && matchedCount === totalCount ? '全部合格' : '待确认'}
            </div>
            <div class="stat-label">清点状态</div>
        </div>
    `;
    
    if (device.shippingChecks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">暂无清点记录</td></tr>';
        return;
    }
    
    tbody.innerHTML = device.shippingChecks.map(check => `
        <tr>
            <td>${check.item_name}</td>
            <td><span class="badge ${itemTypeMap[check.item_type].class}">${itemTypeMap[check.item_type].text}</span></td>
            <td>${check.required_quantity}</td>
            <td>
                ${check.actual_quantity !== null ? 
                  `<span class="badge ${check.actual_quantity === check.required_quantity ? 'badge-success' : 'badge-warning'}">${check.actual_quantity}</span>` : 
                  '<span class="badge badge-blue">待清点</span>'}
            </td>
            <td>${check.checker}</td>
            <td>
                <span class="badge ${check.status === 'matched' ? 'badge-success' : check.status === 'mismatch' ? 'badge-warning' : 'badge-blue'}">
                    ${check.status === 'matched' ? '数量一致' : check.status === 'mismatch' ? '数量不符' : '待清点'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm" onclick="showShippingConfirm(${check.id})">清点</button>
            </td>
        </tr>
    `).join('');
}

function createShippingCheck() {
    const device = devices.find(d => d.id === currentDeviceId);
    const itemName = document.getElementById('shippingItem').value;
    const itemType = document.getElementById('shippingType').value;
    const required = parseInt(document.getElementById('shippingRequired').value);
    const checker = document.getElementById('shippingChecker').value;
    
    if (!itemName || !required || !checker) {
        alert('请填写完整信息');
        return;
    }
    
    device.shippingChecks.push({
        id: Date.now(),
        item_name: itemName,
        item_type: itemType,
        required_quantity: required,
        actual_quantity: null,
        checker: checker,
        status: 'pending',
        created_at: new Date().toISOString()
    });
    
    saveData();
    renderShippingChecks(device);
    hideModal('shippingModal');
    
    document.getElementById('shippingItem').value = '';
    document.getElementById('shippingRequired').value = '';
    document.getElementById('shippingChecker').value = '';
    
    alert('清点项添加成功');
}

function showShippingConfirm(checkId) {
    currentShippingId = checkId;
    showModal('shippingConfirmModal');
}

function confirmShipping() {
    const device = devices.find(d => d.id === currentDeviceId);
    const check = device.shippingChecks.find(c => c.id === currentShippingId);
    const actual = parseInt(document.getElementById('shippingActual').value);
    const status = document.getElementById('shippingStatus').value;
    
    if (!actual) {
        alert('请输入实际数量');
        return;
    }
    
    check.actual_quantity = actual;
    check.status = status;
    
    saveData();
    renderShippingChecks(device);
    hideModal('shippingConfirmModal');
    
    document.getElementById('shippingActual').value = '';
    
    alert('清点确认成功');
}

function renderStatusActions(device) {
    const actionsDiv = document.getElementById('statusActions');
    let buttons = '';
    
    if (device.status === 'assembling') {
        buttons = `
            <button class="btn btn-success" onclick="updateDeviceStatus('testing')">
                ✓ 完成组装，进入测试阶段
            </button>
        `;
    } else if (device.status === 'testing') {
        const allConfirmed = device.testReports.length > 0 && device.testReports.every(r => r.confirmed === true);
        const anyFailed = device.testReports.some(r => r.confirmed === false);
        
        if (allConfirmed && !anyFailed) {
            buttons = `
                <button class="btn btn-success" onclick="updateDeviceStatus('shipping')">
                    ✓ 完成测试，进入发货阶段
                </button>
            `;
        } else if (anyFailed) {
            buttons = `
                <p style="color: #ff4d4f; margin-bottom: 10px;">存在未通过的测试项，请处理后继续</p>
            `;
        } else {
            buttons = `
                <p style="color: #faad14; margin-bottom: 10px;">还有测试项待确认</p>
            `;
        }
    } else if (device.status === 'shipping') {
        const allChecked = device.shippingChecks.length > 0 && 
                          device.shippingChecks.every(c => c.actual_quantity !== null);
        const allMatched = device.shippingChecks.length > 0 && 
                          device.shippingChecks.every(c => c.status === 'matched');
        
        if (allChecked && allMatched) {
            buttons = `
                <button class="btn btn-success" onclick="updateDeviceStatus('shipped')">
                    ✓ 确认发货
                </button>
            `;
        } else if (allChecked && !allMatched) {
            buttons = `
                <p style="color: #faad14; margin-bottom: 10px;">存在数量不符的项目，请检查</p>
            `;
        } else {
            buttons = `
                <p style="color: #faad14; margin-bottom: 10px;">还有项目待清点</p>
            `;
        }
    } else if (device.status === 'shipped') {
        buttons = `
            <p style="color: #52c41a; margin-bottom: 10px;">✓ 设备已发货</p>
        `;
    }
    
    actionsDiv.innerHTML = buttons;
}

function updateDeviceStatus(newStatus) {
    const device = devices.find(d => d.id === currentDeviceId);
    const confirmed = confirm(`确认将设备状态更新为：${statusMap[newStatus].text}？`);
    if (confirmed) {
        device.status = newStatus;
        saveData();
        viewDevice(currentDeviceId);
        alert('状态更新成功');
    }
}

function searchDevice() {
    const deviceNumber = document.getElementById('searchDeviceNumber').value.trim();
    if (!deviceNumber) {
        alert('请输入设备编号');
        return;
    }
    
    const device = devices.find(d => d.device_number === deviceNumber);
    const resultDiv = document.getElementById('trackingResult');
    
    if (!device) {
        resultDiv.innerHTML = '<div class="empty-state">未找到该设备，请检查设备编号</div>';
        return;
    }
    
    resultDiv.innerHTML = `
        <div class="card" style="margin-top: 20px;">
            <div class="card-header">设备信息</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">设备编号</div>
                    <div class="info-value">${device.device_number}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">型号</div>
                    <div class="info-value">${device.model}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">客户</div>
                    <div class="info-value">${device.customer}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">订单号</div>
                    <div class="info-value">${device.order_number}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">状态</div>
                    <div class="info-value"><span class="badge ${statusMap[device.status].class}">${statusMap[device.status].text}</span></div>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 20px;">
            <div class="tabs">
                <div class="tab active" onclick="showTrackingTab('feedback')">客户反馈</div>
                <div class="tab" onclick="showTrackingTab('suggestions')">持续改进</div>
                <div class="tab" onclick="showTrackingTab('records')">品控记录</div>
            </div>
            
            <div id="tracking-feedback" class="tab-content active">
                <div style="margin-bottom: 16px;">
                    <button class="btn" onclick="showModal('feedbackModal')">提交反馈</button>
                </div>
                ${device.feedback.length === 0 ? 
                    '<div class="empty-state">暂无反馈记录</div>' : 
                    device.feedback.map(f => `
                        <div class="feedback-item">
                            <div>
                                <span class="badge ${feedbackTypeMap[f.feedback_type].class}">${feedbackTypeMap[f.feedback_type].text}</span>
                                <span style="margin-left: 10px;">${f.customer} - ${new Date(f.created_at).toLocaleString('zh-CN')}</span>
                            </div>
                            <div class="rating">${'⭐'.repeat(f.rating)}</div>
                            <div>${f.description}</div>
                        </div>
                    `).join('')
                }
            </div>
            
            <div id="tracking-suggestions" class="tab-content">
                <div style="margin-bottom: 16px;">
                    <button class="btn" onclick="showModal('suggestionModal')">添加改进建议</button>
                </div>
                ${device.suggestions.length === 0 ? 
                    '<div class="empty-state">暂无改进建议</div>' : 
                    device.suggestions.map(s => `
                        <div class="suggestion-item ${s.priority}">
                            <div>
                                <span class="badge ${priorityMap[s.priority].class}">${priorityMap[s.priority].text}优先级</span>
                                <span class="badge ${s.status === 'pending' ? 'badge-blue' : s.status === 'in_progress' ? 'badge-warning' : 'badge-success'}">
                                    ${s.status === 'pending' ? '待处理' : s.status === 'in_progress' ? '处理中' : '已完成'}
                                </span>
                            </div>
                            <div style="margin-top: 8px;">${s.suggestion}</div>
                            <div style="font-size: 12px; color: #999; margin-top: 8px;">
                                ${new Date(s.created_at).toLocaleString('zh-CN')}
                            </div>
                            ${s.status === 'pending' ? `
                                <button class="btn btn-sm" style="margin-top: 8px;" onclick="updateSuggestionStatus(${s.id}, 'in_progress')">开始处理</button>
                            ` : ''}
                            ${s.status === 'in_progress' ? `
                                <button class="btn btn-sm btn-success" style="margin-top: 8px;" onclick="updateSuggestionStatus(${s.id}, 'completed')">标记完成</button>
                            ` : ''}
                        </div>
                    `).join('')
                }
            </div>
            
            <div id="tracking-records" class="tab-content">
                <div class="card" style="margin-bottom: 16px;">
                    <div class="card-header">组装检测记录</div>
                    ${device.assemblyChecks.length === 0 ? 
                        '<div class="empty-state">暂无检测记录</div>' : 
                        device.assemblyChecks.map(c => `
                            <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                                <div>
                                    <strong>${c.check_item}</strong>
                                    <span class="badge ${c.status === 'passed' ? 'badge-success' : c.status === 'failed' ? 'badge-error' : 'badge-blue'}" style="margin-left: 8px;">
                                        ${c.status === 'passed' ? '合格' : c.status === 'failed' ? '不合格' : '待检测'}
                                    </span>
                                </div>
                                <div style="font-size: 12px; margin-top: 4px;">${c.description}</div>
                                <div style="font-size: 12px; color: #999; margin-top: 4px;">检测员：${c.inspector}</div>
                            </div>
                        `).join('')
                    }
                </div>
                
                <div class="card" style="margin-bottom: 16px;">
                    <div class="card-header">打样测试记录</div>
                    ${device.testReports.length === 0 ? 
                        '<div class="empty-state">暂无测试记录</div>' : 
                        device.testReports.map(r => `
                            <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                                <div>
                                    <strong>${r.test_item}</strong>
                                    <span class="badge ${r.result === 'pass' ? 'badge-success' : 'badge-error'}" style="margin-left: 8px;">
                                        ${r.result === 'pass' ? '通过' : '不通过'}
                                    </span>
                                    ${r.confirmed === true ? '<span class="badge badge-success" style="margin-left: 8px;">已确认</span>' : ''}
                                </div>
                                <div style="font-size: 12px; margin-top: 4px;">标准：${r.standard}</div>
                                <div style="font-size: 12px; color: #999; margin-top: 4px;">测试员：${r.tester}</div>
                            </div>
                        `).join('')
                    }
                </div>
                
                <div class="card">
                    <div class="card-header">发货清点记录</div>
                    ${device.shippingChecks.length === 0 ? 
                        '<div class="empty-state">暂无清点记录</div>' : 
                        device.shippingChecks.map(c => `
                            <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                                <div>
                                    <strong>${c.item_name}</strong>
                                    <span class="badge ${itemTypeMap[c.item_type].class}" style="margin-left: 8px;">
                                        ${itemTypeMap[c.item_type].text}
                                    </span>
                                </div>
                                <div style="font-size: 12px; margin-top: 4px;">要求：${c.required_quantity} / 实际：${c.actual_quantity || '待清点'}</div>
                                ${c.status === 'matched' ? '<span class="badge badge-success" style="margin-top: 4px;">数量一致</span>' : ''}
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        </div>
    `;
}

function showTrackingTab(tabId) {
    document.querySelectorAll('#trackingResult .tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('#trackingResult .tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById('tracking-' + tabId).classList.add('active');
}

function submitFeedback() {
    const deviceNumber = document.getElementById('searchDeviceNumber').value.trim();
    const device = devices.find(d => d.device_number === deviceNumber);
    
    const feedbackType = document.getElementById('feedbackType').value;
    const rating = parseInt(document.getElementById('feedbackRating').value);
    const desc = document.getElementById('feedbackDesc').value;
    const customer = document.getElementById('feedbackCustomer').value;
    
    if (!desc || !customer) {
        alert('请填写完整信息');
        return;
    }
    
    device.feedback.push({
        id: Date.now(),
        feedback_type: feedbackType,
        description: desc,
        rating: rating,
        customer: customer,
        created_at: new Date().toISOString()
    });
    
    saveData();
    searchDevice();
    hideModal('feedbackModal');
    
    document.getElementById('feedbackDesc').value = '';
    document.getElementById('feedbackCustomer').value = '';
    
    alert('反馈提交成功');
}

function submitSuggestion() {
    const deviceNumber = document.getElementById('searchDeviceNumber').value.trim();
    const device = devices.find(d => d.device_number === deviceNumber);
    
    const suggestionText = document.getElementById('suggestionText').value;
    const priority = document.getElementById('suggestionPriority').value;
    
    if (!suggestionText) {
        alert('请填写改进建议');
        return;
    }
    
    device.suggestions.push({
        id: Date.now(),
        suggestion: suggestionText,
        priority: priority,
        status: 'pending',
        created_at: new Date().toISOString()
    });
    
    saveData();
    searchDevice();
    hideModal('suggestionModal');
    
    document.getElementById('suggestionText').value = '';
    
    alert('改进建议提交成功');
}

function updateSuggestionStatus(suggestionId, newStatus) {
    const deviceNumber = document.getElementById('searchDeviceNumber').value.trim();
    const device = devices.find(d => d.device_number === deviceNumber);
    const suggestion = device.suggestions.find(s => s.id === suggestionId);
    suggestion.status = newStatus;
    saveData();
    searchDevice();
}

document.addEventListener('DOMContentLoaded', init);
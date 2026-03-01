// ========================================
// 奥领数控品控系统 - Supabase 版本
// ========================================

// Supabase 配置 - 请替换为您的实际配置
const SUPABASE_URL = 'https://cjlppzltsaroblzqutra.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbHBwemx0c2Fyb2JsenF1dHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMTY4NDcsImV4cCI6MjA4Nzg5Mjg0N30.jWZM-TnRR-8VHSdO3vvWTmlRMzEargQUS7tE7d9-IrI';

let supabaseClient = null;
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

async function init() {
    let retries = 0;
    const maxRetries = 5;
    const retryDelay = 500; // 500ms
    
    while (retries < maxRetries) {
        try {
            if (typeof window.supabase === 'undefined') {
                throw new Error('Supabase 库未加载');
            }
            
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase 客户端初始化成功');
            await loadDevices();
            return;
        } catch (error) {
            retries++;
            console.log(`初始化尝试 ${retries}/${maxRetries} 失败:`, error.message);
            
            if (retries >= maxRetries) {
                console.error('初始化失败:', error);
                showError('系统初始化失败：' + error.message);
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}

async function loadDevices() {
    if (!supabaseClient) {
        console.error('Supabase 客户端未初始化');
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('devices')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        renderDeviceList(data || []);
    } catch (error) {
        console.error('加载设备列表失败:', error);
        showError('加载设备列表失败');
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
    
    document.getElementById('page-' + pageId).classList.add('active');
    event.target.classList.add('active');
    
    if (pageId === 'devices') {
        if (!supabaseClient) {
            showError('系统正在初始化，请稍后重试');
            return;
        }
        loadDevices();
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

function showError(message) {
    alert('错误: ' + message);
}

function showSuccess(message) {
    alert('成功: ' + message);
}

function renderDeviceList(devices) {
    const tbody = document.getElementById('deviceTableBody');
    if (!devices || devices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">暂无设备</td></tr>';
        return;
    }
    
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

async function viewDevice(id) {
    currentDeviceId = id;
    
    try {
        const data = await loadDeviceDetails(id);
        
        document.getElementById('deviceInfo').innerHTML = `
            <div class="info-item">
                <div class="info-label">设备编号</div>
                <div class="info-value">${data.device.device_number}</div>
            </div>
            <div class="info-item">
                <div class="info-label">型号</div>
                <div class="info-value">${data.device.model}</div>
            </div>
            <div class="info-item">
                <div class="info-label">客户</div>
                <div class="info-value">${data.device.customer}</div>
            </div>
            <div class="info-item">
                <div class="info-label">订单号</div>
                <div class="info-value">${data.device.order_number}</div>
            </div>
            <div class="info-item">
                <div class="info-label">状态</div>
                <div class="info-value"><span class="badge ${statusMap[data.device.status].class}">${statusMap[data.device.status].text}</span></div>
            </div>
            <div class="info-item">
                <div class="info-label">创建时间</div>
                <div class="info-value">${new Date(data.device.created_at).toLocaleString('zh-CN')}</div>
            </div>
        `;
        
        renderAssemblyChecks(data.assemblyChecks);
        renderTestReports(data.testReports);
        renderShippingChecks(data.shippingChecks);
        renderStatusActions(data.device);
        
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById('page-detail').classList.add('active');
    } catch (error) {
        console.error('加载设备详情失败:', error);
        showError('加载设备详情失败');
    }
}

async function loadDeviceDetails(deviceId) {
    try {
        const [deviceRes, assemblyRes, testRes, shippingRes, feedbackRes, suggestionsRes] = await Promise.all([
            supabaseClient.from('devices').select('*').eq('id', deviceId).single(),
            supabaseClient.from('assembly_checks').select('*').eq('device_id', deviceId).order('created_at', { ascending: false }),
            supabaseClient.from('test_reports').select('*').eq('device_id', deviceId).order('test_date', { ascending: false }),
            supabaseClient.from('shipping_checks').select('*').eq('device_id', deviceId).order('created_at', { ascending: false }),
            supabaseClient.from('customer_feedback').select('*').eq('device_id', deviceId).order('created_at', { ascending: false }),
            supabaseClient.from('improvement_suggestions').select('*').eq('device_id', deviceId).order('created_at', { ascending: false })
        ]);
        
        if (deviceRes.error) throw deviceRes.error;
        
        return {
            device: deviceRes.data,
            assemblyChecks: assemblyRes.data || [],
            testReports: testRes.data || [],
            shippingChecks: shippingRes.data || [],
            feedback: feedbackRes.data || [],
            suggestions: suggestionsRes.data || []
        };
    } catch (error) {
        console.error('加载设备详情失败:', error);
        throw error;
    }
}

async function createDevice() {
    const deviceNumber = document.getElementById('deviceNumber').value;
    const model = document.getElementById('deviceModel').value;
    const customer = document.getElementById('deviceCustomer').value;
    const orderNumber = document.getElementById('deviceOrder').value;
    
    if (!deviceNumber || !model || !customer || !orderNumber) {
        showError('请填写完整信息');
        return;
    }
    
    if (!supabaseClient) {
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('devices')
            .insert([{
                device_number: deviceNumber,
                model: model,
                customer: customer,
                order_number: orderNumber,
                status: 'assembling'
            }])
            .select();
        
        if (error) throw error;
        
        showSuccess('设备创建成功');
        hideModal('deviceModal');
        
        document.getElementById('deviceNumber').value = '';
        document.getElementById('deviceModel').value = '';
        document.getElementById('deviceCustomer').value = '';
        document.getElementById('deviceOrder').value = '';
        
        await loadDevices();
    } catch (error) {
        console.error('创建设备失败:', error);
        showError('设备创建失败: ' + (error.message || '未知错误'));
    }
}

function renderAssemblyChecks(checks) {
    const tbody = document.getElementById('assemblyTableBody');
    if (!checks || checks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">暂无检测记录</td></tr>';
        return;
    }
    
    tbody.innerHTML = checks.map(check => `
        <tr>
            <td>${check.check_item}</td>
            <td>${check.description || ''}</td>
            <td>${check.inspector || ''}</td>
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

async function createAssemblyCheck() {
    const checkItem = document.getElementById('assemblyItem').value;
    const desc = document.getElementById('assemblyDesc').value;
    const inspector = document.getElementById('assemblyInspector').value;
    
    if (!checkItem || !desc || !inspector) {
        showError('请填写完整信息');
        return;
    }
    
    if (!supabaseClient) {
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('assembly_checks')
            .insert([{
                device_id: currentDeviceId,
                check_item: checkItem,
                description: desc,
                inspector: inspector,
                status: 'pending'
            }]);
        
        if (error) throw error;
        
        showSuccess('检测项添加成功');
        hideModal('assemblyModal');
        
        document.getElementById('assemblyItem').value = '';
        document.getElementById('assemblyDesc').value = '';
        document.getElementById('assemblyInspector').value = '';
        
        await viewDevice(currentDeviceId);
    } catch (error) {
        console.error('添加检测项失败:', error);
        showError('添加检测项失败');
    }
}

async function updateAssemblyStatus(checkId, status) {
    if (!supabaseClient) {
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('assembly_checks')
            .update({ status: status })
            .eq('id', checkId);
        
        if (error) throw error;
        
        await viewDevice(currentDeviceId);
    } catch (error) {
        console.error('更新状态失败:', error);
        showError('更新状态失败');
    }
}

function renderTestReports(reports) {
    const tbody = document.getElementById('testTableBody');
    if (!reports || reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">暂无测试记录</td></tr>';
        return;
    }
    
    tbody.innerHTML = reports.map(report => `
        <tr>
            <td>${report.test_item}</td>
            <td>${report.standard || ''}</td>
            <td>
                <span class="badge ${report.result === 'pass' ? 'badge-success' : 'badge-error'}">
                    ${report.result === 'pass' ? '通过' : '不通过'}
                </span>
            </td>
            <td>${report.tester || ''}</td>
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

async function createTestReport() {
    const testItem = document.getElementById('testItem').value;
    const standard = document.getElementById('testStandard').value;
    const result = document.getElementById('testResult').value;
    const tester = document.getElementById('testTester').value;
    
    if (!testItem || !standard || !tester) {
        showError('请填写完整信息');
        return;
    }
    
    if (!supabaseClient) {
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('test_reports')
            .insert([{
                device_id: currentDeviceId,
                test_item: testItem,
                standard: standard,
                result: result,
                tester: tester,
                confirmed: null
            }]);
        
        if (error) throw error;
        
        showSuccess('测试报告添加成功');
        hideModal('testModal');
        
        document.getElementById('testItem').value = '';
        document.getElementById('testStandard').value = '';
        document.getElementById('testResult').value = '';
        document.getElementById('testTester').value = '';
        
        await viewDevice(currentDeviceId);
    } catch (error) {
        console.error('添加测试报告失败:', error);
        showError('添加测试报告失败');
    }
}

async function confirmTestReport(reportId) {
    if (!supabaseClient) {
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    const confirmed = confirm('点击"确定"确认通过，点击"取消"确认不通过');
    
    try {
        const { error } = await supabaseClient
            .from('test_reports')
            .update({ confirmed: confirmed })
            .eq('id', reportId);
        
        if (error) throw error;
        
        await viewDevice(currentDeviceId);
    } catch (error) {
        console.error('确认测试报告失败:', error);
        showError('确认测试报告失败');
    }
}

function renderShippingChecks(checks) {
    const tbody = document.getElementById('shippingTableBody');
    const statsDiv = document.getElementById('shippingStats');
    
    const totalCount = checks ? checks.length : 0;
    const checkedCount = checks ? checks.filter(c => c.actual_quantity !== null).length : 0;
    const matchedCount = checks ? checks.filter(c => c.status === 'matched').length : 0;
    
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
    
    if (!checks || checks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">暂无清点记录</td></tr>';
        return;
    }
    
    tbody.innerHTML = checks.map(check => `
        <tr>
            <td>${check.item_name}</td>
            <td><span class="badge ${itemTypeMap[check.item_type]?.class || 'badge-purple'}">${itemTypeMap[check.item_type]?.text || '其他'}</span></td>
            <td>${check.required_quantity}</td>
            <td>
                ${check.actual_quantity !== null ? 
                  `<span class="badge ${check.actual_quantity === check.required_quantity ? 'badge-success' : 'badge-warning'}">${check.actual_quantity}</span>` : 
                  '<span class="badge badge-blue">待清点</span>'}
            </td>
            <td>${check.checker || ''}</td>
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

async function createShippingCheck() {
    const itemName = document.getElementById('shippingItem').value;
    const itemType = document.getElementById('shippingType').value;
    const required = parseInt(document.getElementById('shippingRequired').value);
    const checker = document.getElementById('shippingChecker').value;
    
    if (!itemName || !required || !checker) {
        showError('请填写完整信息');
        return;
    }
    
    if (!supabaseClient) {
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('shipping_checks')
            .insert([{
                device_id: currentDeviceId,
                item_name: itemName,
                item_type: itemType,
                required_quantity: required,
                actual_quantity: null,
                checker: checker,
                status: 'pending'
            }]);
        
        if (error) throw error;
        
        showSuccess('清点项添加成功');
        hideModal('shippingModal');
        
        document.getElementById('shippingItem').value = '';
        document.getElementById('shippingType').value = '';
        document.getElementById('shippingRequired').value = '';
        document.getElementById('shippingChecker').value = '';
        
        await viewDevice(currentDeviceId);
    } catch (error) {
        console.error('添加清点项失败:', error);
        showError('添加清点项失败');
    }
}

function showShippingConfirm(checkId) {
    currentShippingId = checkId;
    showModal('shippingConfirmModal');
}

async function confirmShipping() {
    if (!supabaseClient) {
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    const actual = parseInt(document.getElementById('shippingActual').value);
    const status = document.getElementById('shippingStatus').value;
    
    if (!actual) {
        showError('请输入实际数量');
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('shipping_checks')
            .update({
                actual_quantity: actual,
                status: status
            })
            .eq('id', currentShippingId);
        
        if (error) throw error;
        
        showSuccess('清点确认成功');
        hideModal('shippingConfirmModal');
        
        document.getElementById('shippingActual').value = '';
        
        await viewDevice(currentDeviceId);
    } catch (error) {
        console.error('清点确认失败:', error);
        showError('清点确认失败');
    }
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
        buttons = `
            <p style="color: #faad14; margin-bottom: 10px;">确认所有测试项都已通过后，点击下方按钮</p>
            <button class="btn btn-success" onclick="updateDeviceStatus('shipping')">
                ✓ 完成测试，进入发货阶段
            </button>
        `;
    } else if (device.status === 'shipping') {
        buttons = `
            <p style="color: #faad14; margin-bottom: 10px;">确认所有清点项数量一致后，点击下方按钮</p>
            <button class="btn btn-success" onclick="updateDeviceStatus('shipped')">
                ✓ 确认发货
            </button>
        `;
    } else if (device.status === 'shipped') {
        buttons = `
            <p style="color: #52c41a; margin-bottom: 10px;">✓ 设备已发货</p>
        `;
    }
    
    actionsDiv.innerHTML = buttons;
}

async function updateDeviceStatus(newStatus) {
    if (!supabaseClient) {
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    const confirmed = confirm(`确认将设备状态更新为：${statusMap[newStatus].text}？`);
    if (!confirmed) return;
    
    try {
        const { error } = await supabaseClient
            .from('devices')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', currentDeviceId);
        
        if (error) throw error;
        
        showSuccess('状态更新成功');
        await viewDevice(currentDeviceId);
    } catch (error) {
        console.error('更新状态失败:', error);
        showError('更新状态失败');
    }
}

async function searchDevice() {
    const deviceNumber = document.getElementById('searchDeviceNumber').value.trim();
    if (!deviceNumber) {
        showError('请输入设备编号');
        return;
    }
    
    if (!supabaseClient) {
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('devices')
            .select('*')
            .eq('device_number', deviceNumber)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                document.getElementById('trackingResult').innerHTML = '<div class="empty-state">未找到该设备，请检查设备编号</div>';
                return;
            }
            throw error;
        }
        
        const deviceData = await loadDeviceDetails(data.id);
        renderTrackingResult(deviceData);
    } catch (error) {
        console.error('查询设备失败:', error);
        showError('查询设备失败');
    }
}

function renderTrackingResult(data) {
    document.getElementById('trackingResult').innerHTML = `
        <div class="card" style="margin-top: 20px;">
            <div class="card-header">设备信息</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">设备编号</div>
                    <div class="info-value">${data.device.device_number}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">型号</div>
                    <div class="info-value">${data.device.model}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">客户</div>
                    <div class="info-value">${data.device.customer}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">订单号</div>
                    <div class="info-value">${data.device.order_number}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">状态</div>
                    <div class="info-value"><span class="badge ${statusMap[data.device.status].class}">${statusMap[data.device.status].text}</span></div>
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
                ${renderFeedbackList(data.feedback)}
            </div>
            
            <div id="tracking-suggestions" class="tab-content">
                <div style="margin-bottom: 16px;">
                    <button class="btn" onclick="showModal('suggestionModal')">添加改进建议</button>
                </div>
                ${renderSuggestionList(data.suggestions)}
            </div>
            
            <div id="tracking-records" class="tab-content">
                ${renderRecordsList(data)}
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

function renderFeedbackList(feedback) {
    if (!feedback || feedback.length === 0) {
        return '<div class="empty-state">暂无反馈记录</div>';
    }
    
    return feedback.map(f => `
        <div class="feedback-item">
            <div>
                <span class="badge ${feedbackTypeMap[f.feedback_type]?.class || 'badge-blue'}">${feedbackTypeMap[f.feedback_type]?.text || '其他'}</span>
                <span style="margin-left: 10px;">${f.customer || ''} - ${new Date(f.created_at).toLocaleString('zh-CN')}</span>
            </div>
            <div class="rating">${'⭐'.repeat(f.rating || 0)}</div>
            <div>${f.description || ''}</div>
        </div>
    `).join('');
}

function renderSuggestionList(suggestions) {
    if (!suggestions || suggestions.length === 0) {
        return '<div class="empty-state">暂无改进建议</div>';
    }
    
    return suggestions.map(s => `
        <div class="suggestion-item ${s.priority}">
            <div>
                <span class="badge ${priorityMap[s.priority]?.class || 'badge-blue'}">${priorityMap[s.priority]?.text || '中'}优先级</span>
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
    `).join('');
}

async function updateSuggestionStatus(suggestionId, newStatus) {
    if (!supabaseClient) {
        showError('系统正在初始化，请稍后重试');
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('improvement_suggestions')
            .update({ status: newStatus })
            .eq('id', suggestionId);
        
        if (error) throw error;
        
        await searchDevice();
    } catch (error) {
        console.error('更新建议状态失败:', error);
        showError('更新建议状态失败');
    }
}

function renderRecordsList(data) {
    return `
        <div class="card" style="margin-bottom: 16px;">
            <div class="card-header">组装检测记录</div>
            ${data.assemblyChecks.length === 0 ? 
                '<div class="empty-state">暂无检测记录</div>' : 
                data.assemblyChecks.map(c => `
                    <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                        <div>
                            <strong>${c.check_item}</strong>
                            <span class="badge ${c.status === 'passed' ? 'badge-success' : c.status === 'failed' ? 'badge-error' : 'badge-blue'}" style="margin-left: 8px;">
                                ${c.status === 'passed' ? '合格' : c.status === 'failed' ? '不合格' : '待检测'}
                            </span>
                        </div>
                        <div style="font-size: 12px; margin-top: 4px;">${c.description || ''}</div>
                        <div style="font-size: 12px; color: #999; margin-top: 4px;">检测员：${c.inspector || ''}</div>
                    </div>
                `).join('')
            }
        </div>
        
        <div class="card" style="margin-bottom: 16px;">
            <div class="card-header">打样测试记录</div>
            ${data.testReports.length === 0 ? 
                '<div class="empty-state">暂无测试记录</div>' : 
                data.testReports.map(r => `
                    <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                        <div>
                            <strong>${r.test_item}</strong>
                            <span class="badge ${r.result === 'pass' ? 'badge-success' : 'badge-error'}" style="margin-left: 8px;">
                                ${r.result === 'pass' ? '通过' : '不通过'}
                            </span>
                            ${r.confirmed === true ? '<span class="badge badge-success" style="margin-left: 8px;">已确认</span>' : ''}
                        </div>
                        <div style="font-size: 12px; margin-top: 4px;">标准：${r.standard || ''}</div>
                        <div style="font-size: 12px; color: #999; margin-top: 4px;">测试员：${r.tester || ''}</div>
                    </div>
                `).join('')
            }
        </div>
        
        <div class="card">
            <div class="card-header">发货清点记录</div>
            ${data.shippingChecks.length === 0 ? 
                '<div class="empty-state">暂无清点记录</div>' : 
                data.shippingChecks.map(c => `
                    <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                        <div>
                            <strong>${c.item_name}</strong>
                            <span class="badge ${itemTypeMap[c.item_type]?.class || 'badge-purple'}" style="margin-left: 8px;">
                                ${itemTypeMap[c.item_type]?.text || '其他'}
                            </span>
                        </div>
                        <div style="font-size: 12px; margin-top: 4px;">要求：${c.required_quantity} / 实际：${c.actual_quantity || '待清点'}</div>
                        ${c.status === 'matched' ? '<span class="badge badge-success" style="margin-top: 4px;">数量一致</span>' : ''}
                    </div>
                `).join('')
            }
        </div>
    `;
}

document.addEventListener('load', init);
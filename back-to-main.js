// 返回主系统按钮功能
(function() {
    'use strict';
    
    // 创建返回主系统按钮的样式
    const style = document.createElement('style');
    style.textContent = `
        .back-to-main-btn {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .back-to-main-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }
        
        .back-to-main-btn:active {
            transform: translateY(0);
        }
        
        .back-to-main-btn .icon {
            font-size: 16px;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .back-to-main-btn {
                top: 15px;
                left: 15px;
                padding: 10px 16px;
                font-size: 12px;
            }
            
            .back-to-main-btn .icon {
                font-size: 14px;
            }
        }
        
        @media (max-width: 480px) {
            .back-to-main-btn {
                top: 10px;
                left: 10px;
                padding: 8px 12px;
                font-size: 11px;
            }
            
            .back-to-main-btn .icon {
                font-size: 12px;
            }
        }
    `;
    
    // 添加样式到页面
    document.head.appendChild(style);
    
    // 创建返回主系统按钮
    function createBackButton() {
        const button = document.createElement('button');
        button.className = 'back-to-main-btn';
        button.innerHTML = '<span class="icon">🏠</span>返回主系統';
        button.title = '返回主系统';
        
        // 添加点击事件
        button.addEventListener('click', function() {
            // 尝试多种方式返回主系统
            if (window.parent && window.parent !== window) {
                // 如果在iframe中，通知父窗口
                window.parent.postMessage({ action: 'backToMain' }, '*');
            } else if (window.opener) {
                // 如果是通过window.open打开的，关闭当前窗口
                window.close();
            } else {
                // 直接跳转到主系统
                window.location.href = '../index.html';
            }
        });
        
        return button;
    }
    
    // 等待DOM加载完成后添加按钮
    function initBackButton() {
        // 检查是否已经存在返回按钮
        if (document.querySelector('.back-to-main-btn')) {
            return;
        }
        
        const button = createBackButton();
        document.body.appendChild(button);
        
        // 监听来自父窗口的消息
        window.addEventListener('message', function(event) {
            if (event.data && event.data.action === 'backToMain') {
                window.location.href = '../index.html';
            }
        });
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackButton);
    } else {
        initBackButton();
    }
    
    // 导出函数供外部调用
    window.BackToMain = {
        init: initBackButton,
        createButton: createBackButton
    };
})();

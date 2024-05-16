// ==UserScript==
// @name         Auto Download ChatGPT's voice
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically downloads the audio file when playing chatgpt's read aloud. 当播放chatgpt的朗读时，自动将声音文件下载下来
// @author       Naki
// @match        *://chatgpt.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==



(function() {
    'use strict';

    // 保存原始fetch函数
    const originalFetch = window.fetch;

    // 重写fetch函数
    window.fetch = function(...args) {
        // 检查URL中是否包含"backend-api/synthesize"
        const url = args[0];
        if (typeof url === 'string' && url.includes('backend-api/synthesize')) {
            console.log('Intercepted fetch:', url);
            return originalFetch(...args)
                .then(response => {
                    // 克隆响应，因为响应只能被读取一次
                    const responseClone = response.clone();

                    // 将响应转换为Blob对象并下载
                    responseClone.blob().then(blob => {
                        const objectURL = URL.createObjectURL(blob);
                        console.log('Object URL:', objectURL);

                        const a = document.createElement('a');
                        a.href = objectURL;
                        a.download = 'response.aac'; // 设置文件名
                        document.body.appendChild(a);
                        a.click(); // 模拟点击以下载文件
                        document.body.removeChild(a); // 移除链接元素
                    });

                    // 返回原始响应以确保正常运行
                    return response;
                })
                .catch(error => {
                    console.error('Error fetching the response:', error);
                    throw error;
                });
        }

        // 如果URL不包含关键词，则正常执行fetch
        return originalFetch(...args);
    };

})();

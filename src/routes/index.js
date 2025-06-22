var express = require('express');
var router = express.Router();

// Hàm escape để chống XSS
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

router.get('/', function (req, res, next) {
    res.render('index');
});

// Note search feature - Đã fix XSS
router.get('/search', function (req, res, next) {
    const q = req.query.q || '';

    // Kiểm tra từ khóa "script"
    if (q.search(/script/i) >= 0) {
        res.send('Hack detected');
        return;
    }

    // Escape output
    const safeQ = escapeHTML(q);

    // Thêm header CSP để tăng cường bảo vệ
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; object-src 'none'");

    const html = 'Your search - <b>' + safeQ + '</b> - did not match any notes.<br><br>';
    res.send(html);
});

module.exports = router;

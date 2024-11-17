var db = require('./db');
var util = require('./util'); // util.js 추가
var sanitizeHtml = require('sanitize-html');

module.exports = {
    typeview : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = 'SELECT * FROM code;';
            db.query(sql1 + sql2, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var codes = results[1];
    
                var context = {
                    who : name,
                    login : login,
                    body : 'boardtype.ejs', // boardtype.ejs를 넘겨줌
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        } else { res.redirect('/') }
    },
    typecreate : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = 'SELECT * FROM code;';
            db.query(sql1 + sql2, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var codes = results[1];
    
                var context = {
                    who : name,
                    login : login,
                    body : 'boardtypeCU.ejs', // boardtypeCU.ejs를 넘겨줌
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    crud : 'create' // boardtypeCU.ejs에 넘겨줄 변수
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        } else { res.redirect('/') }
    },
    typecreate_process : (req, res) => {
        var boardtype = req.body;
        var sntzedTitle = sanitizeHtml(boardtype.title);
        var sntzedDescription = sanitizeHtml(boardtype.description);
        var sntzedNumPerPage = sanitizeHtml(boardtype.numPerPage);
        var sntzedWriteYN = sanitizeHtml(boardtype.write_YN);
        var sntzedReYN = sanitizeHtml(boardtype.re_YN);
        db.query('INSERT INTO boardtype(title, description, numPerPage, write_YN, re_YN) VALUES(?, ?, ?, ?, ?)', 
                  [sntzedTitle, sntzedDescription, sntzedNumPerPage, sntzedWriteYN, sntzedReYN], (error, result) => {
            if(error) { throw error; }
            res.redirect('/board/type/view');
        });
    },
    typeupdate : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sntzedTypeId = sanitizeHtml(req.params.typeId);
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM boardtype WHERE type_id=${sntzedTypeId};`;
            var sql3 = 'SELECT * FROM code;';
            db.query(sql1 + sql2 + sql3, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var boardtype = results[1];
                var codes = results[2];
    
                var context = {
                    who : name,
                    login : login,
                    body : 'boardtypeCU.ejs', // boardtypeCU.ejs를 넘겨줌
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- boardtypeCU.ejs에 넘겨줄 변수 --- */
                    boardtype : boardtype,
                    crud : 'update'  
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        } else { res.redirect('/') }
    },
    typeupdate_process : (req, res) => {
        var boardtype = req.body;
        var sntzedTitle = sanitizeHtml(boardtype.title);
        var sntzedDescription = sanitizeHtml(boardtype.description);
        var sntzedNumPerPage = sanitizeHtml(boardtype.numPerPage);
        var sntzedWriteYN = sanitizeHtml(boardtype.write_YN);
        var sntzedReYN = sanitizeHtml(boardtype.re_YN);
        var sntzedTypeId = sanitizeHtml(boardtype.type_id);
        db.query('UPDATE boardtype SET title=?, description=?, numPerPage=?, write_YN=?, re_YN=? WHERE type_id=?', 
                  [sntzedTitle, sntzedDescription, sntzedNumPerPage, sntzedWriteYN, sntzedReYN, sntzedTypeId], (error, result) => {
            if(error) { throw error; }
            res.redirect('/board/type/view');
        });
    },
    typedelete_process : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sntzedTypeId = sanitizeHtml(req.params.typeId);
            db.query('DELETE FROM boardtype WHERE type_id=?', [sntzedTypeId], (error, result) => {
                if(error) { throw error; }
                res.redirect('/board/type/view');
            });
        } else { res.redirect('/') }
    },

    view : (req, res) => {
        var sntzedTypeId = sanitizeHtml(req.params.typeId);
        var pNum = req.params.pNum;
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM boardtype where type_id=${sntzedTypeId};`;
        var sql3 = `SELECT COUNT(*) AS total FROM board WHERE type_id=${sntzedTypeId};`;
        var sql4 = 'SELECT * FROM code;';
        db.query(sql1 + sql2 + sql3 + sql4, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            /* --- 페이지 기능 구현 --- */
            var numPerPage = results[1][0].numPerPage;
            var offs = (pNum-1) * numPerPage;
            var totalPages = Math.ceil(results[2][0].total / numPerPage);
            db.query(`SELECT b.board_id as board_id, b.title as title, b.date as date, p.name as name
                      FROM board b INNER JOIN person p ON b.loginid=p.loginid
                      WHERE b.type_id=? AND b.p_id=? ORDER BY date DESC, board_id DESC
                      LIMIT ? OFFSET ?`, [sntzedTypeId, 0, numPerPage, offs], (error2, boards) => {
                if(error2) { throw error2; }
                var boardtypes = results[0];
                var boardtype = results[1];
                var boardCount = results[2];
                var codes = results[3];

                var context = {
                    who : name,
                    login : login,
                    body : 'board.ejs', // board.ejs를 넘겨줌
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- board.ejs에 넘겨줄 변수 --- */
                    totalPages : totalPages,
                    pNum : pNum,
                    boardtype : boardtype,
                    boardCount : boardCount,
                    boards : boards
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                }); 
            });
        });
    },
    create : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 로그인이 되어 있을 경우에만 --- */
        if(login) {
            var sntzedTypeId = sanitizeHtml(req.params.typeId);
            var sntzedLoginId = sanitizeHtml(req.session.loginid);
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM boardtype WHERE type_id=${sntzedTypeId};`;
            var sql3 = 'SELECT * FROM code;';
            db.query(sql1 + sql2 + sql3, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var boardtype = results[1];
                var codes = results[2];
                var now = util.dateOfEightDigit();

                /* --- 관리자이거나 고객이지만 고객이 글을 쓸 수 있는 게시판일 경우에만 mainFrame을 렌더링함 --- */
                if(cls === 'MNG' || (cls === 'CST' && boardtype[0].write_YN === 'Y')) {
                    var context = {
                        who : name, // boardCRU에도 넘겨짐
                        login : login,
                        body : 'boardCRU.ejs', // boardCRU.ejs를 넘겨줌
                        cls : cls,
                        boardtypes : boardtypes,
                        codes : codes,
                        /* --- boardCRU.ejs에 넘겨줄 변수 --- */
                        sntzedLoginId : sntzedLoginId,
                        boardtype : boardtype,
                        now : now,
                        crud : 'create'
                    };
                    res.render('mainFrame', context, (err, html) => {
                        res.end(html);
                    });    
                } else { res.redirect('/') }
            });
        } else { res.redirect('/') }
    },
    create_process : (req, res) => {
        var board = req.body;
        var sntzedTypeId = sanitizeHtml(board.type_id);
        var sntzedLoginId = sanitizeHtml(board.loginid);
        var sntzedPassword = sanitizeHtml(board.password);
        var sntzedTitle = sanitizeHtml(board.title);
        var sntzedDate = sanitizeHtml(board.date);
        var sntzedContent = sanitizeHtml(board.content);
        db.query('INSERT INTO board(type_id, p_id, loginid, password, title, date, content) VALUES(?, 0, ?, ?, ?, ?, ?)', // NOW()에서 수정
                  [sntzedTypeId, sntzedLoginId, sntzedPassword, sntzedTitle, sntzedDate, sntzedContent], (error, result) => {
            if(error) { throw error; }
            res.redirect(`/board/view/${sntzedTypeId}/1`);
        });
    },
    detail : (req, res) => {
        var sntzedBoardId = sanitizeHtml(req.params.boardId);
        var pNum = req.params.pNum;
        var sntzedLoginId = sanitizeHtml(req.session.loginid);
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM board INNER JOIN person ON board.loginid=person.loginid WHERE board_id=${sntzedBoardId};`;
        var sql3 = 'SELECT * FROM code;';
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            var boardtypes = results[0];
            var board = results[1];
            var codes = results[2];

            var context = {
                who : name,
                login : login,
                body : 'boardCRU.ejs', 
                cls : cls,
                boardtypes : boardtypes,
                codes : codes,
                /* --- boardCRU.ejs에 넘겨줄 변수 --- */
                pNum : pNum,
                sntzedLoginId : sntzedLoginId,
                board : board,
                crud : 'read'
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });  
        });
    },
    update : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 로그인이 되어 있을 경우에만 --- */
        if(login){
            var sntzedBoardId = sanitizeHtml(req.params.boardId);
            var sntzedTypeId = sanitizeHtml(req.params.typeId);
            var pNum = req.params.pNum;
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM boardtype WHERE type_id=${sntzedTypeId};`;
            var sql3 = `SELECT * FROM board INNER JOIN person ON board.loginid=person.loginid WHERE board_id=${sntzedBoardId};`;
            var sql4 = 'SELECT * FROM code;';
            db.query(sql1 + sql2 + sql3 + sql4, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var boardtype = results[1];
                var board = results[2];
                var codes = results[3];

                /* --- 관리자이거나, 고객이면서 아이디가 일치할 경우에만 mainFrame을 렌더링함 --- */
                if(cls === 'MNG' || (cls === 'CST' && board[0].loginid === req.session.loginid)) {
                    var context = {
                        who : name, 
                        login : login,
                        body : 'boardCRU.ejs', 
                        cls : cls,
                        boardtypes : boardtypes,
                        codes : codes,
                        /* --- boardCRU.ejs에 넘겨줄 변수 --- */
                        pNum : pNum,
                        boardtype : boardtype,
                        board : board,
                        crud : 'update'
                    };
                    res.render('mainFrame', context, (err, html) => {
                        res.end(html);
                    });   
                } else { res.redirect('/') }
            });
        } else { res.redirect('/') }
    },
    update_process : (req, res) => {
        var board = req.body;
        var sntzedTitle = sanitizeHtml(board.title);
        var sntzedContent = sanitizeHtml(board.content);
        var sntzedBoardId = sanitizeHtml(board.board_id);
        var sntzedTypeId = sanitizeHtml(board.type_id);
        var sntzedPassword = sanitizeHtml(board.password);
        var pNum = board.pNum;
        db.query(`SELECT b.type_id as type_id, b.board_id as board_id, b.loginid as loginid, b.password as password, p.class as class
                  FROM board b INNER JOIN person p ON b.loginid=p.loginid WHERE b.board_id=? AND b.type_id=?`, [sntzedBoardId, sntzedTypeId], (error, board) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            /* --- 고객일 경우 설정해둔 비밀번호가 일치하지 않으면 글 수정 불가 --- */
            if(cls === 'CST' && sntzedPassword !== board[0].password) {
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
                res.end(`<script language=JavaScript type="text/javascript">
                            alert("비밀번호가 일치하지 않습니다.");
                            setTimeout("location.href='http://localhost:3000/board/update/${sntzedBoardId}/${sntzedTypeId}/${pNum}'", 1000);
                         </script>`);
                return;
            }
            db.query('UPDATE board SET title=?, content=? WHERE board_id=? AND type_id=?', 
                      [sntzedTitle, sntzedContent, sntzedBoardId, sntzedTypeId], (error2, result) => {
                if(error2) { throw error; }
                res.redirect(`/board/detail/${sntzedBoardId}/${pNum}`);
            });
        });
    },
    delete_process : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        var sntzedBoardId = sanitizeHtml(req.params.boardId);
        /* --- 로그인이 되어 있을 경우에만 --- */
        if(login) {
            db.query('SELECT * FROM board WHERE board_id=?', [sntzedBoardId], (error, board) => {
                if(error) { throw error; }
                /* --- 관리자이거나, 고객이면서 본인이 쓴 글에 대해 삭제 가능 --- */
                if(cls === 'MNG' || (cls === 'CST' && board[0].loginid === req.session.loginid)) {
                    var sntzedBoardId = sanitizeHtml(req.params.boardId);
                    var sntzedTypeId = sanitizeHtml(req.params.typeId);
                    db.query('DELETE FROM board WHERE board_id=? AND type_id=?', [sntzedBoardId, sntzedTypeId], (error2, result) => {
                        if(error2) { throw error2; }
                        res.redirect(`/board/view/${sntzedTypeId}/1`);
                    });
                } else { res.redirect('/') }
            });
        } else { res.redirect('/') }
    }
}
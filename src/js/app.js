/*!
 * @license GPL-3.0 License
 * Created by EliF_Lee on 2021.10.08.
 * Last Upaded on 2021.12.30.
 * @author : EliF_Lee 
 */

const checkHttps = true;
const checkVersion = true;
const secureCookie = true;
const useShortLink = false;

const baseURL = 'https://api.xqing.tech/Forum';
// const baseURL = 'http://localhost:3000';

const Manager = new Vue({
    el: '.Manager',
    data: {
        Web_Version: '1.0.0',
        desktop: {
            header: { isOpen: false },
            menu: { isOpen: false }
        },
        mobile: {
            menu: {
                isOpen: false,
                style: 'hidden flex-col pt-4'
            }
        },
        loadingStatus: {
            isLoading: false,
            message: ''  
        },
        loginWeb: { loadingStatus: 'none' },
        alertBanner: {
            message: '[!]',
            closed: true
        },
        user: {
            isLogged: false,
            id: '',
            name: '',
            profile: `${baseURL}/src/assets/images/profile_na.PNG`,
            detail: {
                isAdmin: false
            }
        },
        style: { copyrightGradient: 'bg-clip-text text-transparent bg-gradient-to-tr from-indigo-500 to-pink-400' },
        article: {
            articleTab: { tabStatus: 1 },
            articleList: {
                articleCount: 0,
                allArticlesTemplate: '',
                announceArticlesTemplate: ''
            },
            articleStatus: 'none',
            write: {
                title: '',
                titleClass: 'pl-3 pr-3 flex-1 py-2 border-b-2 opacity-100 border-gray-400 focus:border-green-500 text-gray-600 placeholder-gray-400 outline-none',
                message: '',
                messageClass: 'pl-3 pr-3 flex-1 py-2 border-b-2 opacity-100 border-gray-400 focus:border-green-500 text-gray-600 placeholder-gray-400 outline-none h-96'
            },
            view: {
                menu: {
                    isOpen: false,
                    ableToDelete: false,
                    articleURLStatus: '<i class="far fa-link mr-3"></i>URL 복사'
                },
                viewerLoadFinish: false,
                id: '',
                status: '',
                viewCount: '...',
                title: '...',
                message: '...',
                date: '...',
                author: {
                    id: '...',
                    nickname: '...',
                    profile: `https://elif-lee.github.io/src/assets/images/profile_na.PNG`,
                    isAdmin: false
                },
                comments: {
                    count: 0,
                    template: ''
                }
            },
            writeComment: { message: '' }
        }
    },
    methods: {
        toggleMenu: function() 
        {
            this.mobile.menu.isOpen = !this.mobile.menu.isOpen;
            this.mobile.menu.style = `${this.mobile.menu.isOpen ? 'flex' : 'hidden'} flex-col pt-4`;
        },
        changeTabStatus: function(status) 
        {
            this.article.articleTab.tabStatus = status;
        },
        goLoginPage: function() 
        {
            location.href = '../login.html';
        },
        viewArticleMenuReset: function() 
        {
            this.article.view.menu.isOpen = false;
            this.article.view.menu.articleURLStatus = '<i class="far fa-link mr-3"></i>URL 복사';
        },
        CopyURL: function() 
        {
            let copyText = `https://elif-lee.github.io/view/viewArticle.html?id=${this.article.view.id}`;
            if (useShortLink) { copyText= `https://elif-lee.github.io/view/${this.article.view.id}`; }
            navigator.clipboard.writeText(copyText);
            this.article.view.menu.articleURLStatus = `<i class="fas fa-check-circle mr-3" style="color: limegreen"></i>URL 복사 완료`;
        },
        DeleteArticle: function() 
        {
            if (confirm(`글 번호 ${this.article.view.id}번을 삭제 하시겠습니까?`)) { alert('서비스 준비 중입니다.'); }
        },
        RestoreArticle: function() 
        {
            if (confirm(`글 번호 ${this.article.view.id}번을 복구 하시겠습니까?`)) { alert('서비스 준비 중입니다.'); }
        },
        AnnounceArticle: function() 
        {
            if (confirm(`글 번호 ${this.article.view.id}번을 공지로 등록하시겠습니까?`)) { alert('서비스 준비 중입니다.'); }
        },
        ReportArticle: function() 
        {
            if (confirm(`글 번호 ${this.article.view.id}번을 신고 하시겠습니까?`)) { alert('서비스 준비 중입니다.'); }
        },
        loginWithKakao: function() 
        {
            setCookieEmpty();
            Kakao.Auth.login({
                success: function(authObj) 
                {
                    Manager.loginWeb.loadingStatus = 'loading';
                    $.cookie('_Kat', authObj.access_token, {expires: 365, secure: secureCookie, path: '/'});
                    $.cookie('_Krt', authObj.refresh_token, {expires: 365, secure: secureCookie, path: '/'});
                    checkUserData();
                },
                fail: function(err) 
                {
                    Manager.loginWeb.loadingStatus = 'fail';
                },
            });
        },
        logoutFromKakao: function() 
        {
            if (confirm('로그아웃 하시겠습니까?')) 
            {
                this.loadingStatus.isLoading = true;
                this.loadingStatus.message = '로그아웃 중입니다. 잠시만 기다려 주세요.';
                requestLogout($.cookie('_Kat'));
            }
        },
        moveToWriteArticle: function() 
        {
            if (this.user.isLogged){ location.href = "../writeArticle.html"; } 
            else { alert('로그인 후 이용하실 수 있습니다.'); this.goLoginPage(); }
        },
        submitArticle: function() 
        {
            if (this.article.write.title === '' || this.article.write.message === '') 
            {
                this.article.write.title === '' ? (this.article.write.titleClass = 'pl-3 pr-3 flex-1 py-2 border-b-2 opacity-100 border-red-400 text-gray-600 placeholder-red-400 outline-none') : (this.article.write.titleClass = 'pl-3 pr-3 flex-1 py-2 border-b-2 opacity-100 border-gray-400 focus:border-green-400 text-gray-600 placeholder-gray-400 outline-none');
                this.article.write.message === '' ? (this.article.write.messageClass = 'pl-3 pr-3 flex-1 py-2 border-b-2 opacity-100 border-red-400 text-red-600 placeholder-red-400 outline-none h-96') : (this.article.write.messageClass = 'pl-3 pr-3 flex-1 py-2 border-b-2 opacity-100 border-gray-400 focus:border-green-400 text-gray-600 placeholder-gray-400 outline-none h-96');
            } 
            else 
            {
                this.article.articleStatus = 'loading';
                writeArticle();
            }
        },
        submitComment: function() 
        {
            if ((this.article.writeComment.message).replaceAll(' ', '') === '') { alert('댓글 내용을 입력해주세요.'); } 
            else { writeComment(this.article.writeComment.message); this.article.writeComment.message = ''; }
        }
    }
});

$(function() {
    if (checkHttps && location.protocol !== 'https:')
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    if (checkVersion)
        checkWebVersion();
    writeDetail();
});

function checkWebVersion() 
{
    $.get(`${baseURL}/versionCheck.php`, function(response){
        if (response.status === 200) 
        {
            if (response.data.version !== Manager.Web_Version) 
            {
                Manager.alertBanner.message = `[!] 현재 사용 중인 버전은 [ v${Manager.Web_Version} ] 이며, 최신 버전은 [ v${response.data.version} ] 입니다. 사이트 캐시를 삭제하여 최신 버전으로 업데이트를 해주시기 바랍니다.`;
                Manager.alertBanner.closed = false;
            }
        }
    });
}

function viewArticle(id, isPrivate, authorId = '') 
{
    if (isPrivate && (authorId !== Manager.user.id || Manager.user.detail.isAdmin)) 
    {
        return alert('비공개 글은 작성자와 관리자만 확인할 수 있습니다.');
    }
    if (useShortLink) { location.href = `view/${id}`; } 
    else location.href = `view/viewArticle.html?id=${id}`;
}

function setCookieEmpty(goBack = false) 
{
    userInfoInit();
    let cookies = $.cookie();
    for(let cookie in cookies) { $.removeCookie(cookie, {path: '/'}); }
    if (goBack) { location.href = '../index.html'; }
}

function requestLogout(kat) 
{
    const KakaoAccessToken = kat;
    $.ajax({
        url: `${baseURL}/login/kakao/auth.php?m=logout`,
        type: 'POST',
        data: { kat: KakaoAccessToken },
        success: function(response, textStatus, jqXHR) 
        {
            Manager.loadingStatus.isLoading = false;
            if (response.status === 200) 
            {
                setCookieEmpty();
                location.reload();
            } 
            else 
            {
                setCookieEmpty();
                location.reload();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            Manager.loadingStatus.isLoading = false;
            setCookieEmpty();
            location.reload();
        }
    });
}

function editStatus(status) 
{
    switch (status) 
    {
        case 'DELETED':
            break;
        case 'NORMAL':
            break;
        case 'ANNOUNCE':
            break;
    }

    $.ajax({
        url: `${baseURL}/editArticle.php?m=status`,
        type: 'POST',
        data: { kat: KakaoAccessToken },
        success: function(response, textStatus, jqXHR) 
        {
            Manager.loadingStatus.isLoading = false;
            if (response.status === 200) 
            {
                setCookieEmpty();
                location.reload();
            } 
            else 
            {
                setCookieEmpty();
                location.reload();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            Manager.loadingStatus.isLoading = false;
            setCookieEmpty();
            location.reload();
        }
    });
}

function colorGradient() 
{
    const ColorScale = [ 100, 200, 300, 400, 500, 600, 700 ];
    let blue = 6, green = 0, changer = true;
    setInterval(function() {
        if (changer) 
        {
            blue--, green++;
            if (green === ColorScale.length - 1) { changer = false; }
        } 
        else 
        {
            blue++, green--;
            if (blue === ColorScale.length - 1) { changer = true; }
        }
        Manager.style.copyrightGradient = `bg-clip-text text-transparent bg-gradient-to-tr from-indigo-${ColorScale[blue]} to-pink-${ColorScale[green]}`;
    }, 200);
}

function userInfoInit() 
{
    Manager.user.isLogged = false;
    Manager.user.name = '';
    Manager.user.profile = `https://elif-lee.github.io/src/assets/images/profile_na.PNG`;
    Manager.user.detail.isAdmin = false;
}

function writeDetail() 
{
    Manager.loadingStatus.isLoading = true;
    Manager.loadingStatus.message = '사용자 정보를 가져오는 중입니다.';

    const BinaryTag = $.cookie('_Bt');
    const AesKey = $.cookie('_aesK');
    if (BinaryTag === undefined || AesKey === undefined) { checkUserData(); } 
    else { LoginCheck(JSON.parse(aesDecrypt(BinaryTag, AesKey))); }
}

function checkUserData() 
{
    const KakaoAccessToken = $.cookie('_Kat');
    if (KakaoAccessToken === undefined) { Manager.loadingStatus.isLoading = false; setCookieEmpty(); } 
    else { getUserData(KakaoAccessToken); }
}

function LoginCheck(array) 
{
    Manager.loadingStatus.isLoading = false;
    Manager.loginWeb.loadingStatus = 'success';
    Manager.user.isLogged = true;
    Manager.user.id = array.userData.id;
    Manager.user.name = array.userData.nickname;
    Manager.user.profile = (array.userData.thumbnail_image_url).replace('http://', 'https://');
    Manager.user.detail.isAdmin = array.userDetail.isAdmin;
}

function getUserData(KakaoAccessToken) 
{
    const AccessToken = $.cookie('_At');
    let method, requestData;
    if (AccessToken === undefined) 
    {
        method = 'token';
        requestData = { kat: KakaoAccessToken };
    } 
    else 
    {        
        method = 'data';
        requestData = { kat: KakaoAccessToken, at: AccessToken };
    }

    $.ajax({
        url: `${baseURL}/login/kakao/auth.php?m=${method}`,
        type: 'POST', data: requestData,
        success: function(response, textStatus, jqXHR) 
        {
            if (response.status === 200) 
            {
                if (method === 'token') 
                {
                    $.cookie('_aesK', response.aesKey, {expires: 365, secure: secureCookie, path: '/'});
                    $.cookie('_At', response.token, {expires: 365, secure: secureCookie, path: '/'});
                    getUserData($.cookie('_Kat'));
                } 
                else if (method === 'data') 
                {
                    if ($.cookie('_aesK') === undefined) 
                    {
                        Manager.loadingStatus.isLoading = false;
                        Manager.loginWeb.loadingStatus = 'fail';
                        return setCookieEmpty();
                    }
                    $.cookie('_Bt', aesEncrypt(JSON.stringify(response), $.cookie('_aesK')), {expires: 365, secure: secureCookie, path: '/'});
                    LoginCheck(response);
                }
            } 
            else 
            {
                setCookieEmpty();
                Manager.loadingStatus.isLoading = false;
                Manager.loginWeb.loadingStatus = 'fail';
                alert(`Error [${response.status}]\n${response.reason}`);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            Manager.loadingStatus.isLoading = false;
            Manager.loginWeb.loadingStatus = 'fail';
            console.error('Error occurred: '+ textStatus, errorThrown);
        }
    });
}

function aesEncrypt(data, key) 
{
    return CryptoJS.AES.encrypt(data, key).toString();
}

function aesDecrypt(data, key) 
{
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}

function getArticleList() 
{
    Manager.article.articleList.allArticlesTemplate = `<div class="text-center text-2xl">
        <i class="fas fa-spinner fa-pulse"></i>
    </div>`;
    Manager.article.articleList.announceArticlesTemplate = `<div class="text-center text-2xl">
        <i class="fas fa-spinner fa-pulse"></i>
    </div>`;

    $.ajax({
        url: `${baseURL}/articleList.php`,
        type: 'GET', data: {},
        success: function(response, textStatus, jqXHR) 
        {
            if (response.status === 200) { writeArticleList(response); } 
            else 
            {
                Manager.article.articleList.allArticlesTemplate = `<div class="text-center text-base">
                    <i class="fas fa-times-circle pr-2 text-red-500"></i>게시글 목록을 불러오지 못했습니다
                </div>`
                Manager.article.articleList.announceArticlesTemplate = `<div class="text-center text-base">
                    <i class="fas fa-times-circle pr-2 text-red-500"></i>게시글 목록을 불러오지 못했습니다
                </div>`
            }
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            Manager.article.articleList.allArticlesTemplate = `<div class="text-center text-base">
                <i class="fas fa-times-circle pr-2 text-red-500"></i>게시글 목록을 불러오지 못했습니다
            </div>`
            Manager.article.articleList.announceArticlesTemplate = `<div class="text-center text-base">
                <i class="fas fa-times-circle pr-2 text-red-500"></i>게시글 목록을 불러오지 못했습니다
            </div>`
        }
    });
}

function writeArticleList(array) 
{
    Manager.article.articleList.allArticlesTemplate = '';
    Manager.article.articleList.announceArticlesTemplate = '';
    Manager.article.articleList.articleCount = array.articleCount;
    if (array.articleCount === 0) 
    {
        Manager.article.articleList.allArticlesTemplate = `<div class="text-center text-base">
            <i class="fas fa-ghost pr-2 text-gray-500"></i>작성된 게시글이 없습니다
        </div>`
    }
    if (array.articleAnnounce.length === 0) 
    {
        Manager.article.articleList.announceArticlesTemplate = `<div class="text-center text-base">
            <i class="fas fa-ghost pr-2 text-gray-500"></i>작성된 게시글이 없습니다
        </div>`
    }
    for(let i in array.articleList) 
    {
        Manager.article.articleList.allArticlesTemplate += `<div onclick="viewArticle('${array.articleList[i].articleId}', ${array.articleList[i].articleStatus === 'PRIVATE' ? `true, '${array.articleList[i].author.id}'` : 'false'})">
            <p class="text-xl pb-1">
                ${
                    (array.articleList[i].articleStatus === 'PRIVATE') 
                    ? `<i class="fas fa-lock pr-1.5 text-sm"></i> ` 
                    : ((array.articleList[i].articleStatus === 'ANNOUNCE')
                        ? '<i class="fas fa-bullhorn pr-1.5 text-sm"></i>'
                        : ''
                    )
                }
                <span class="hover:text-blue-700">${array.articleList[i].articleTitle}</span>
            </p>
            <p class="text-gray-500">
                <span class="text-sm">${array.articleList[i].author.nickname}</span>
                ${
                    (array.articleList[i].author.isAdmin)
                    ? `<span class="fa-stack -mx-1" style="font-size: 0.5em;" title="관리자">
                            <i class="fas fa-certificate fa-stack-2x" style="color: dimgray;"></i>
                            <i class="fas fa-check fa-stack-1x" style="color: limegreen;"></i>
                        </span>`
                    : ``
                }
                <span class="pl-1.5 text-sm">
                    <span>${array.articleList[i].articleDate}</span>
                    <span class="pl-1.5">조회 ${array.articleList[i].articleView}</span>
                </span>
            </p>
        </div>`;

        if ((array.articleCount - 1) != i)
        {
            Manager.article.articleList.allArticlesTemplate += `<div class="pt-5 pb-5"><hr style="border: 1px solid rgba(128, 128, 128, 0.3); border-radius: 5px;"></div>`
        }
    }
    for(let i in array.articleAnnounce) 
    {
        Manager.article.articleList.announceArticlesTemplate += `<div onclick="viewArticle('${array.articleAnnounce[i].articleId}', ${array.articleAnnounce[i].articleStatus === 'PRIVATE' ? `true, '${array.articleAnnounce[i].author.id}'` : 'false'})">
            <p class="text-xl pb-1">
                ${
                    (array.articleAnnounce[i].articleStatus === 'PRIVATE') 
                    ? `<i class="fas fa-lock pr-1.5 text-sm"></i> ` 
                    : ((array.articleAnnounce[i].articleStatus === 'ANNOUNCE')
                        ? '<i class="fas fa-bullhorn pr-1.5 text-sm"></i>'
                        : ''
                    )
                }
                <span>${array.articleAnnounce[i].articleTitle}</span>
            </p>
            <p class="text-gray-500">
                <span class="text-sm">${array.articleAnnounce[i].author.nickname}</span>
                ${
                    (array.articleList[i].author.isAdmin)
                    ? `<span class="fa-stack -mx-1" style="font-size: 0.5em;" title="관리자">
                            <i class="fas fa-certificate fa-stack-2x" style="color: dimgray;"></i>
                            <i class="fas fa-check fa-stack-1x" style="color: limegreen;"></i>
                        </span>`
                    : ``
                }
                <span class="pl-1.5 text-sm">
                    <span>${array.articleAnnounce[i].articleDate}</span>
                    <span class="pl-1.5">조회 ${array.articleAnnounce[i].articleView}</span>
                </span>
            </p>
        </div>`;

        if ((array.articleAnnounce.length - 1) != i)
        {
            Manager.article.articleList.announceArticlesTemplate += `<div class="pt-5 pb-5"><hr style="border: 1px solid rgba(128, 128, 128, 0.3); border-radius: 5px;"></div>`
        }
    }
}

function writeArticle() 
{
    const KakaoAccessToken = $.cookie('_Kat');
    const AccessToken = $.cookie('_At');
    const aesKeyValue = $.cookie('_aesK');

    if (KakaoAccessToken === undefined || AccessToken === undefined || aesKeyValue === undefined) 
    {
        alert('로그인 후 이용하실 수 있습니다.');
        setCookieEmpty(true);
    }

    $.ajax({
        url: `${baseURL}/writeArticle.php`,
        type: 'POST',
        data: {
            kat: KakaoAccessToken, 
            at: AccessToken,
            enc_title: Manager.article.write.title,
            enc_message: Manager.article.write.message
        },
        success: function(response, textStatus, jqXHR) 
        {
            if (response.status === 200) 
            {
                Manager.article.articleStatus = 'success';
                setTimeout(function() { 
                    if (useShortLink) { location.href = `view/${response.detail.articleId}`; } 
                    else location.href = `view/viewArticle.html?id=${response.detail.articleId}`;
                }, 500);
            } 
            else 
            {
                setCookieEmpty();
                Manager.article.articleStatus = 'fail';
                alert(`Error [${response.status}]\n${response.reason}`);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            Manager.article.articleStatus = 'fail';
            console.error('Error occurred: '+ textStatus, errorThrown);
        }
    });
}

function urlParam(name)
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has(name)) { return urlParams.get(name); } 
    else { return false; }
}

function checkAbletoDelete(authorId) 
{
    if (authorId === Manager.user.id || (Manager.user.isLogged && Manager.user.detail.isAdmin)) 
    {
        Manager.article.view.menu.ableToDelete = true;
    }
}

function linkify(text, isComment = false) 
{
    if (isComment) { text = decodeURIComponent(atob(text).replaceAll('+', '&nbsp;')).replaceAll('\n', '<br>'); }
    
    let urlRegex = /(?:(?:https?):\/\/|www\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;

    return text.replace(urlRegex, function(url) {
        let urlText = url.replaceAll('&nbsp', '');
        let urlWithoutUrlText = url.replaceAll(urlText, '');
        return `<a href="javascript:window.open('${(urlText.startsWith('https://') || urlText.startsWith('http://') ? urlText : `https://${urlText}`)}', '_blank')" class="text-blue-500 hover:text-blue-800">${urlText}</a>${urlWithoutUrlText}`;
    });
}

function pushArticleData(articleData)
{
    const articleViewManager = Manager.article.view;

    articleViewManager.id = articleData.articleId;
    articleViewManager.status = articleData.articleStatus;
    articleViewManager.viewCount = `조회 ${articleData.articleView}`;
    articleViewManager.title = articleData.title;
    articleViewManager.message = linkify(articleFormat(articleData.message));
    articleViewManager.date = articleData.date;
    articleViewManager.author.id = articleData.author.id;
    articleViewManager.author.nickname = articleData.author.nickname;
    articleViewManager.author.profile = (articleData.author.profile).replace('http://', 'https://');
    articleViewManager.author.isAdmin = articleData.author.isAdmin;
}

function getArticleData() 
{
    const KakaoAccessToken = $.cookie('_Kat');
    const AccessToken = $.cookie('_At');
    let articleId = urlParam('id');
    let requestData;

    if (articleId === false) 
    {
        let path = (window.location.pathname).split('/').pop();
        if (!isNaN(path) && path !== '') { articleId = path; } 
        else { alert('글 아이디를 입력해주세요.'); location.href = '../index.html'; }
    }
    
    if (KakaoAccessToken === undefined || AccessToken === undefined) 
    {
        setCookieEmpty();
        requestData = { isLogin: false, articleId: articleId }
    } 
    else 
    {
        requestData = {
            isLogin: true, kat: KakaoAccessToken,
            at: AccessToken, articleId: articleId
        }
    }
    
    if (articleId !== 0) 
    {
        $.ajax({
            url: `${baseURL}/viewArticle.php`,
            type: 'POST', data: requestData,
            success: function(response, textStatus, jqXHR) 
            {
                if (response.status === 200) 
                {
                    getComments(articleId);
                    checkAbletoDelete(response.articleData.author.id);
                    pushArticleData(response.articleData);
                } 
                else 
                {
                    alert(`${response.reason}`);
                    if ([206, 300, 301].includes(response.status)) { setCookieEmpty(true); } 
                    else { location.href = '../index.html'; }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                alert('글을 가져올 수 없습니다.');
                location.href = '../index.html';
            }
        });
    }
}

function articleFormat(string) 
{
    return string
    .replaceAll(' ', '&nbsp;')
    .replaceAll('\n', '<br>')
    .replaceAll(':line:', '<div class="pt-5"><hr style="border: 1px solid rgba(128, 128, 128, 0.3); border-radius: 5px;"></div>')
}

function writeComment(text) 
{
    const KakaoAccessToken = $.cookie('_Kat');
    const AccessToken = $.cookie('_At');
    let articleId = Manager.article.view.id;

    if (articleId === '') 
    {
        let idQuery = urlParam('id');
        if (idQuery !== 0) { articleId = idQuery; } 
        else { alert('오류가 발생했습니다.'); location.href = '../index.html'; }
    }

    if (KakaoAccessToken === undefined || AccessToken === undefined) 
    {
        alert('로그인 후 이용하실 수 있습니다.');
        setCookieEmpty(true);
    }

    if (articleId !== 0) 
    {
        $.ajax({
            url: `${baseURL}/writeComment.php`,
            type: 'POST',
            data: {
                kat: KakaoAccessToken, at: AccessToken,
                articleId: articleId, enc_message: text
            },
            success: function(response, textStatus, jqXHR) 
            {
                if (response.status === 200) { getComments(articleId); } 
                else 
                {
                    alert(`${response.reason}`);
                    if ([206, 300, 301, 302, 303].includes(response.status)) { setCookieEmpty(true); } 
                    else { location.href = '../index.html'; }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                alert('댓글을 등록할 수 없습니다.');
                location.href = '../index.html';
            }
        });
    }
}

function getComments(id) 
{
    const KakaoAccessToken = $.cookie('_Kat');
    const AccessToken = $.cookie('_At');
    let requestData;

    if (KakaoAccessToken === undefined || AccessToken === undefined) 
    {
        setCookieEmpty();
        requestData = { isLogin: false, articleId: id }
    } 
    else 
    {
        requestData = {
            isLogin: true, kat: KakaoAccessToken,
            at: AccessToken, articleId: id
        }
    }

    $.ajax({
        url: `${baseURL}/viewComments.php`,
        type: 'POST', data: requestData,
        success: function(response, textStatus, jqXHR) 
        {
            if (response.status === 200) { showComments(response.comments); } 
            else 
            {
                alert(`${response.reason}`);
                if ([206, 300, 301].includes(response.status)) { setCookieEmpty(true); } 
                else { location.href = '../index.html'; }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            alert('댓글을 가져올 수 없습니다.');
            location.href = '../index.html';
        }
    });
}

function showComments(array) 
{
    Manager.article.view.comments.count = array.length;
    Manager.article.view.comments.template = '';
    for(let i = 0; i < array.length; i++) 
    {
        Manager.article.view.comments.template += `<div id="articleComment" class="pb-5">
            <div class="flex items-center">
                <div class="float-left pr-2">
                    <img src="${(array[i].profile).replace('http://', 'https://')}" onerror="this.src='https:\/\/elif-lee/src/assets/images/profile_nu.PNG'" class="realtive z-10 w-8 h-8 rounded-full overflow-hidden">
                </div>
                <div>
                    <p class="text-base">
                        <span>${decodeURIComponent(atob(array[i].nickname).replaceAll('+', '&nbsp;'))}</span>
                        ${
                            (array[i].isAdmin)
                            ? `<span class="fa-stack -mx-1" style="font-size: 0.5em;" title="관리자">
                                    <i class="fas fa-certificate fa-stack-2x" style="color: dimgray;"></i>
                                    <i class="fas fa-check fa-stack-1x" style="color: limegreen;"></i>
                                </span>`
                            : ``
                        }
                    </p>
                </div>
            </div>
            <div class="pt-1 pl-10 text-sm">
                <span>${linkify(array[i].message, true)}</span>
            </div>
            <div class="pt-0.5 pl-10 text-gray-500 text-xs">
                ${array[i].time}
            </div>
        </div>`;
    }
    if (array.length !== 0) 
        Manager.article.view.comments.template += `<div class="pb-5"><hr style="border: 1px solid rgba(128, 128, 128, 0.3); border-radius: 5px;"></div>`;
    Manager.article.view.viewerLoadFinish = true;
}
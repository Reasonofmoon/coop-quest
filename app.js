'use strict';
(() => {
  const STORE = 'coop-quest:v1';
  const MAX_BYTES = 2 * 1024 * 1024;
  const MAX_ROWS = 1000;
  const $ = id => document.getElementById(id);
  const copy = {
    en: {
      skip:'Skip to content', brandSub:'A little game. Real collaboration.', star:'Star on GitHub', eyebrow:'YOUR LOCAL COLLABORATION ADVENTURE', hero:'Ship together.\nLevel up for real.', intro:'Turn useful co-authored pull requests into a personal quest. See the evidence, keep the credit honest, and make something better together.', unofficial:'An unofficial local game, not an official GitHub badge counter.', stepOne:'01 / CHOOSE YOUR START', launchTitle:'Bring your work to the quest.', privacyPill:'No login. No tokens. No analytics.', username:'GitHub username', scan:'Scan public PRs', cancel:'Cancel scan', scanHelp:"Only when you click: your username is sent to GitHub's public API. Up to 20 merged PRs and 100 commits per PR. Co-author trailer emails are not stored.", demo:'Try a synthetic demo', import:'Import evidence JSON', export:'Export evidence', ready:'Ready when you are. Nothing is fetched automatically.', observed:'Eligible PRs in this dataset', noData:'No evidence loaded', questXP:'Local quest XP', xpRule:'100 XP per unique eligible PR', yourLevel:'Your local level', stepTwo:'02 / SMALL STEPS, SHARED WINS', milestones:'Your collaboration ladder', ladderDisclaimer:'Community-reported thresholds, not a badge award prediction. Counts are only from this dataset, never your complete account.', thresholdSource:'About the thresholds', stepThree:'03 / THE RECEIPTS MATTER', evidenceTitle:'Collaboration evidence', clear:'Clear dataset', searchLabel:'Search PR titles', filterLabel:'Filter evidence', filterAll:'All evidence', linked:'Linked authors', candidate:'Trailer candidates', personalQuest:'YOUR NEXT REAL CONTRIBUTION', checklistTitle:'The good teammate quest', checklistIntro:'A private checklist, not evidence. Progress here never adds PRs or XP.', resetQuest:'Reset checklist', truthTitle:'Evidence, not wishful thinking.', truthBody:'A commit trailer is a clue, not proof of an account or a verified human. A public REST scan only finds candidates. Imported linked-author evidence is stronger, but this app does not independently verify it.', readMethod:'Read the project & methodology', footer:'Built for useful work, not badge farming.', localOnly:'Saved in this browser only.',
      q1:'Find a useful change', q1sub:'A real bug, clearer docs, or an improvement someone needs.', q2:'Collaborate with a teammate', q2sub:'Agree on the work. Credit each real contribution.', q3:'Test the change', q3sub:'Check the behavior and include reproducible results.', q4:'Open a thoughtful PR', q4sub:'Explain the why. Add accurate co-author credit.', q5:'Get it reviewed and merged', q5sub:'Address feedback and thank your collaborators.',
      emptyTitle:'Your next shared win starts here.', emptyBody:'Scan public PRs, import linked-author evidence, or try the clearly labeled demo. An empty dataset is not an account-wide total.', noResults:'No matching evidence.', noResultsBody:'Try another title or evidence filter.', emptyScan:'No eligible candidates in this limited scan.', emptyScanBody:'This does not mean your account has no co-authored PRs. Search is limited to PRs you authored, and only the first 100 commits are inspected.',
      demoTitle:'SYNTHETIC DEMO / Not your GitHub activity', demoNotice:'These made-up PRs demonstrate the interface. Demo XP and goals are illustrative only. The example links are not genuine PRs and cannot be opened here.', importTitle:'Imported evidence / Not independently verified', importNotice:'This file is a local claim, not a GitHub verification. Linked-author rows qualify only when the player and another distinct account appear in coauthors. Your progress is limited to this dataset.', restTitle:'Public REST candidates / Incomplete coverage', restNotice:'Only a commit originally authored by the player with a Co-authored-by trailer is a candidate. Trailer names are not resolved to accounts or verified humans. This scan cannot establish official GitHub achievement credit.',
      synthetic:'Synthetic demo', eligible:'Eligible in this dataset', excluded:'Not eligible', demoTag:'DEMO', importTag:'IMPORTED', candidateTag:'CANDIDATE', linkedTag:'LINKED AUTHORS', source:'Source', player:'Player', merged:'Merged', author:'Original author', prAuthor:'PR author', coauthors:'Coauthors', evidenceDetails:'Inspect evidence', commit:'Commit SHA', linkedExplain:'The provided linked-author list contains account names. It is imported evidence, not independently verified by this app.', candidateExplain:'The original commit author matches the player and the commit has a co-author trailer. Names alone do not prove GitHub account credit.', excludedExplain:'This row does not meet the eligibility rule for its evidence type. It adds no XP.', demoExplain:'Synthetic example only. No genuine contribution or account credit is claimed.', prLabel:'PRs', reached:'Reached locally', next:'Next local goal', later:'Later goal', goal:'NEXT GOAL', goalsDone:'LADDER COMPLETE', goalRemaining:'{n} more eligible PRs to the {goal}-PR goal in this dataset.', allGoals:'All four local goals reached in this dataset. Keep building useful things.', zeroGoal:'Start with one useful co-authored PR. No account-wide progress is assumed.', levelProgress:'{n} / 300 XP toward the next level', questProgress:'{n} / 5 complete', caption:'{linked} linked-author rows · {candidate} candidates', demoCaption:'Illustrative progress only', datasetMeta:'Player: {player} · {rows} unique rows · Saved: {date}\nCoverage: {scope}\nCounts describe this dataset only, not official awards.',
      keptAfterCancel:'Scan cancelled. Your previous dataset was retained; no new dataset was saved.',keptAfterFailure:'Scan did not finish: {reason}. Your previous dataset was retained; no new dataset was saved.',invalidUsername:'Enter a valid GitHub username: 1–39 letters, numbers, or single hyphens. No leading or trailing hyphen.', scanning:'Searching public merged PRs for {player}…', inspecting:'Inspecting PR {done} of {total} · {found} candidates so far…', completed:'Scan saved: {found} eligible candidates from {done} inspected PRs. Coverage is incomplete.', partial:'Partial scan saved: {found} candidates; {errors} PR lookup(s) failed. Coverage is incomplete.', cancelled:'Scan cancelled. {found} candidates from completed lookups were saved as a partial dataset.', scanFailed:'Scan could not finish: {reason}. Any completed candidates were saved as partial evidence.', rateError:'GitHub rate limit or access limit reached. Try again after the reset time shown below.', networkError:'Network request failed or GitHub is unavailable', timeoutError:'GitHub request timed out', httpError:'GitHub returned HTTP {status}', rateInfo:'Public API: {remaining} / {limit} requests remaining · Reset: {reset}', rateUnknown:'Public API rate-limit headers are unavailable.', importing:'Reading and validating evidence…', imported:'Imported {rows} unique rows; {eligible} eligible. {duplicates} duplicates dropped. Not independently verified.', invalidImport:'Import rejected: {reason}', importLimit:'JSON must be at most 2 MB and contain no more than 1,000 rows.', badJSON:'The file is not valid JSON.', badSchema:'Expected schemaVersion 1 and a valid player, source, timestamp, coverage, and pullRequests array.', badRow:'Row {n} contains an invalid URL, date, title, author, coauthor, evidence type, or commit SHA.', demoLoaded:'Synthetic demo loaded. These are not your actual GitHub contributions.', cleared:'Dataset cleared from this browser. Your private checklist is unchanged.', resetDone:'Private checklist reset. Evidence and XP are unchanged.', exported:'Normalized evidence JSON exported. Review before sharing: it may contain private repository URLs and titles. Your checklist is not included.', storageWarning:'Browser storage is unavailable or full. Changes work for this session but may not persist.', fatalBody:'Unexpected data could not be read. Try importing a valid evidence file.', scanScope:'Limited public REST search: up to 20 merged PRs authored by {player}; first 100 commits per PR. {done}/{total} PRs inspected. Search reported {reported} results. {errors} failed lookup(s). No account-wide completeness.', demoScope:'Five fictional merged PRs for demonstration only; no actual account coverage.', importScope:'Imported evidence; coverage not independently verified.',
    },
    ko: {
      skip:'본문으로 이동',brandSub:'작은 게임. 진짜 협업.',star:'Star on GitHub',eyebrow:'내 브라우저에서 시작하는 협업 퀘스트',hero:'함께 만들고.\n진짜 실력을 키우세요.',intro:'유용한 공동 작업 PR을 나만의 퀘스트로 모아 보세요. 근거를 확인하고, 기여를 정확히 기록하며, 함께 더 좋은 결과를 만드세요.',unofficial:'GitHub 공식 배지 집계기가 아닌, 비공식 로컬 게임입니다.',stepOne:'01 / 시작 방법 선택',launchTitle:'실제 작업을 퀘스트로 가져오세요.',privacyPill:'로그인, 토큰, 분석 추적 없음',username:'GitHub 사용자 이름',scan:'공개 PR 살펴보기',cancel:'조회 취소',scanHelp:'버튼을 누를 때만 사용자 이름을 GitHub 공개 API에 보냅니다. 병합된 PR 최대 20개와 PR당 커밋 100개를 조회합니다. 공동 작성자 트레일러의 이메일은 저장하지 않습니다.',demo:'가상 데모 체험',import:'근거 JSON 가져오기',export:'근거 내보내기',ready:'준비되면 시작하세요. 자동 조회는 하지 않습니다.',observed:'이 데이터의 조건 충족 PR',noData:'불러온 근거 없음',questXP:'로컬 퀘스트 XP',xpRule:'조건을 충족하는 고유 PR당 100 XP',yourLevel:'내 로컬 레벨',stepTwo:'02 / 작은 걸음, 함께 만든 성과',milestones:'협업 목표 사다리',ladderDisclaimer:'커뮤니티에서 보고된 기준이며 배지 획득 예측이 아닙니다. 이 데이터만 집계하며 계정 전체를 뜻하지 않습니다.',thresholdSource:'기준 출처 보기',stepThree:'03 / 기여의 근거 확인',evidenceTitle:'협업 근거',clear:'데이터 비우기',searchLabel:'PR 제목 검색',filterLabel:'근거 필터',filterAll:'모든 근거',linked:'연결된 작성자',candidate:'트레일러 후보',personalQuest:'다음 실제 기여를 위한 준비',checklistTitle:'좋은 팀원 퀘스트',checklistIntro:'나만의 체크리스트이며 기여 근거가 아닙니다. 체크해도 PR 수나 XP는 늘지 않습니다.',resetQuest:'체크리스트 초기화',truthTitle:'추측 대신 근거를 봅니다.',truthBody:'커밋 트레일러는 단서일 뿐, 계정이나 실제 사람을 검증하지 않습니다. 공개 REST 조회는 후보만 찾습니다. 가져온 작성자 연결 근거가 더 강하지만 이 앱이 직접 검증하지는 않습니다.',readMethod:'프로젝트와 집계 방식 보기',footer:'배지 수집보다 유용한 작업을 위해.',localOnly:'이 브라우저에만 저장합니다.',q1:'유용한 개선점 찾기',q1sub:'실제 버그, 더 명확한 문서, 필요한 개선을 찾으세요.',q2:'팀원과 함께 작업하기',q2sub:'할 일을 합의하고 실제 기여를 정확히 기록하세요.',q3:'변경 사항 테스트하기',q3sub:'동작을 확인하고 재현 가능한 결과를 남기세요.',q4:'설명 있는 PR 열기',q4sub:'변경 이유를 쓰고 공동 작성자 기여를 정확히 적으세요.',q5:'검토 후 병합하기',q5sub:'피드백을 반영하고 함께한 사람에게 감사를 전하세요.',emptyTitle:'함께 만든 다음 성과를 기록하세요.',emptyBody:'공개 PR을 조회하거나 작성자 연결 근거를 가져오세요. 가상 데모도 체험할 수 있습니다. 빈 데이터는 계정 전체 집계가 아닙니다.',noResults:'조건에 맞는 근거가 없습니다.',noResultsBody:'다른 제목이나 근거 필터로 찾아보세요.',emptyScan:'이번 제한된 조회에서 조건 충족 후보가 없습니다.',emptyScanBody:'계정에 공동 작성 PR이 없다는 뜻은 아닙니다. 직접 연 PR만 찾고 PR당 처음 100개 커밋만 확인합니다.',demoTitle:'가상 데모 / 실제 GitHub 활동이 아닙니다',demoNotice:'가상의 PR로 화면을 보여줍니다. XP와 목표 진척도는 예시일 뿐입니다. 예시 주소는 실제 PR이 아니며 여기서 열 수 없습니다.',importTitle:'가져온 근거 / 앱에서 직접 검증하지 않았습니다',importNotice:'이 파일은 로컬 자료이며 GitHub 검증 결과가 아닙니다. 작성자 연결 행은 coauthors에 본인과 다른 계정이 함께 있어야 조건을 충족합니다. 진척도는 이 데이터에 한정됩니다.',restTitle:'공개 REST 후보 / 조회 범위가 불완전합니다',restNotice:'본인이 원래 작성한 커밋에 Co-authored-by 트레일러가 있을 때만 후보로 봅니다. 이름을 계정이나 검증된 사람으로 연결하지 않습니다. 공식 GitHub 업적 기여 여부를 확정할 수 없습니다.',synthetic:'가상 데모',eligible:'이 데이터에서 조건 충족',excluded:'조건 미충족',demoTag:'DEMO',importTag:'가져옴',candidateTag:'후보',linkedTag:'작성자 연결',source:'출처',player:'사용자',merged:'병합',author:'원래 작성자',prAuthor:'PR 작성자',coauthors:'공동 작성자',evidenceDetails:'근거 자세히 보기',commit:'커밋 SHA',linkedExplain:'제공된 작성자 목록에는 계정 이름이 있습니다. 가져온 근거이며 이 앱이 직접 검증하지 않았습니다.',candidateExplain:'원래 커밋 작성자가 본인이며 공동 작성자 트레일러가 있습니다. 이름만으로 GitHub 계정 기여를 증명하지는 않습니다.',excludedExplain:'이 행은 해당 근거 유형의 조건을 충족하지 않습니다. XP에 반영하지 않습니다.',demoExplain:'가상 예시입니다. 실제 기여나 계정 업적으로 주장하지 않습니다.',prLabel:'PR',reached:'로컬 목표 달성',next:'다음 로컬 목표',later:'이후 목표',goal:'다음 목표',goalsDone:'로컬 목표 완료',goalRemaining:'이 데이터에서 {goal}개 목표까지 조건 충족 PR {n}개가 더 필요합니다.',allGoals:'이 데이터에서 네 가지 로컬 목표를 달성했습니다. 계속 유용한 작업을 함께하세요.',zeroGoal:'유용한 공동 작성 PR 하나부터 시작하세요. 계정 전체의 진척도를 추정하지 않습니다.',levelProgress:'다음 레벨까지 {n} / 300 XP',questProgress:'{n} / 5 완료',caption:'작성자 연결 {linked}개 · 후보 {candidate}개',demoCaption:'가상의 진척도 예시',datasetMeta:'사용자: {player} · 고유 행 {rows}개 · 기록: {date}\n조회 범위: {scope}\n이 데이터만 집계하며 공식 업적 획득 여부를 뜻하지 않습니다.',keptAfterCancel:'조회를 취소했습니다. 새 데이터는 저장하지 않았고 기존 데이터는 유지했습니다.',keptAfterFailure:'조회를 마치지 못했습니다: {reason}. 새 데이터는 저장하지 않았고 기존 데이터는 유지했습니다.',invalidUsername:'올바른 GitHub 사용자 이름을 입력하세요. 영문, 숫자, 하이픈으로 1~39자이며 처음과 끝에 하이픈 또는 연속 하이픈을 쓸 수 없습니다.',scanning:'{player}의 공개 병합 PR을 찾고 있습니다…',inspecting:'PR {total}개 중 {done}개 확인 · 현재 후보 {found}개…',completed:'조회 저장: PR {done}개 확인, 조건 충족 후보 {found}개. 조회 범위는 불완전합니다.',partial:'부분 조회 저장: 후보 {found}개. PR 조회 {errors}개 실패. 조회 범위는 불완전합니다.',cancelled:'조회를 취소했습니다. 완료한 조회의 후보 {found}개를 부분 데이터로 저장했습니다.',scanFailed:'조회를 마치지 못했습니다: {reason}. 완료한 후보가 있다면 부분 근거로 저장했습니다.',rateError:'GitHub 요청 또는 접근 제한에 도달했습니다. 아래 초기화 시각 이후 다시 시도하세요.',networkError:'네트워크 요청이 실패했거나 GitHub에 연결할 수 없습니다',timeoutError:'GitHub 응답 시간이 초과되었습니다',httpError:'GitHub HTTP {status} 응답',rateInfo:'공개 API: 요청 {limit}회 중 {remaining}회 남음 · 초기화: {reset}',rateUnknown:'공개 API 요청 제한 정보를 받을 수 없습니다.',importing:'근거를 읽고 확인하고 있습니다…',imported:'고유 행 {rows}개 가져옴, 조건 충족 {eligible}개. 중복 {duplicates}개 제외. 앱에서 직접 검증하지 않았습니다.',invalidImport:'가져오기 거절: {reason}',importLimit:'JSON은 2 MB 이하이며 행 수는 1,000개 이하여야 합니다.',badJSON:'올바른 JSON 파일이 아닙니다.',badSchema:'schemaVersion 1, 올바른 player, source, 시각, coverage, pullRequests 배열이 필요합니다.',badRow:'{n}번째 행의 주소, 날짜, 제목, 작성자, 공동 작성자, 근거 유형 또는 커밋 SHA가 올바르지 않습니다.',demoLoaded:'가상 데모를 불러왔습니다. 실제 GitHub 기여가 아닙니다.',cleared:'이 브라우저의 데이터를 비웠습니다. 개인 체크리스트는 유지합니다.',resetDone:'개인 체크리스트를 초기화했습니다. 근거와 XP는 유지합니다.',exported:'근거 JSON을 내보냈습니다. 공유 전에 비공개 저장소 주소와 제목이 있는지 확인하세요. 체크리스트는 포함하지 않습니다.',storageWarning:'브라우저 저장 공간을 쓸 수 없거나 가득 찼습니다. 이번 세션에서는 작동하지만 다음에 유지되지 않을 수 있습니다.',fatalBody:'데이터를 읽을 수 없습니다. 올바른 근거 파일을 가져오세요.',scanScope:'제한된 공개 REST 조회: {player}이 직접 연 병합 PR 최대 20개, PR당 처음 100개 커밋. {total}개 중 {done}개 확인. 검색 결과 {reported}개. 조회 실패 {errors}개. 계정 전체 집계가 아님.',demoScope:'화면 체험용 가상 병합 PR 5개. 실제 계정 조회가 아님.',importScope:'가져온 근거. 조회 범위를 직접 검증하지 않았습니다.',
    }
  };
  let state = {lang:'en',username:'',checklist:[false,false,false,false,false],dataset:null,origin:null};
  let activeScan = null;
  let rate = null;
  let currentStatus = {key:'ready',args:{},tone:''};
  let storageFailed = false;
  let importBusy = false;
  function t(key,args={}) { return (copy[state.lang][key] || copy.en[key] || key).replace(/\{(\w+)\}/g,(_,k)=>String(args[k] ?? '')); }
  const loginOK = value => typeof value === 'string' && /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(value) && !value.includes('--');
  const plain = (value,max) => typeof value === 'string' && value.trim().length>0 && value.length<=max && !/[\u0000-\u001f\u007f]/.test(value);
  function dateOK(value) {
    if(typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) return false;
    const date = new Date(value);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0,19) === value.slice(0,19);
  }
  function prURL(value) {
    if(typeof value !== 'string' || value.length>250) return null;
    const match = /^https:\/\/github\.com\/([a-z\d](?:[a-z\d-]{0,37}[a-z\d])?)\/([a-z\d_.-]{1,100})\/pull\/([1-9]\d{0,9})\/?$/i.exec(value);
    if(!match || !loginOK(match[1]) || match[2]==='.' || match[2]==='..') return null;
    return {url:'https://github.com/'+match[1]+'/'+match[2]+'/pull/'+match[3],owner:match[1],repo:match[2],number:match[3]};
  }
  function fail(key,args) { const error = new Error(key); error.key=key;error.args=args;throw error; }
  function normalizeDataset(data) {
    if(!data || typeof data!=='object' || Array.isArray(data) || data.schemaVersion!==1 || !loginOK(data.player) || !['public-rest','graphql','demo'].includes(data.source) || !dateOK(data.scannedAt) || !data.coverage || typeof data.coverage.complete!=='boolean' || !plain(data.coverage.scope,600) || !Array.isArray(data.pullRequests)) fail('badSchema');
    if(data.pullRequests.length>MAX_ROWS) fail('importLimit');
    const rows=[];const seen=new Set();let duplicates=0;
    data.pullRequests.forEach((row,index)=>{
      const link=prURL(row?.url);
      if(!row || !link || !plain(row.title,500) || !dateOK(row.mergedAt) || (row.authorLogin!==null && !loginOK(row.authorLogin)) || (row.evidence==='trailer-candidate' && !loginOK(row.authorLogin)) || !['linked-authors','trailer-candidate'].includes(row.evidence) || !Array.isArray(row.coauthors) || row.coauthors.length>100 || (row.commitSha!==undefined && (typeof row.commitSha!=='string' || !/^[a-f\d]{7,64}$/i.test(row.commitSha)))) fail('badRow',{n:index+1});
      const authorSeen=new Set();const coauthors=[];
      for(const person of row.coauthors) {
        const valid = row.evidence==='linked-authors' ? loginOK(person) : plain(person,80) && !/[<>@]/.test(person);
        if(!valid) fail('badRow',{n:index+1});
        const name=person.trim();if(!authorSeen.has(name.toLowerCase())){authorSeen.add(name.toLowerCase());coauthors.push(name);}
      }
      const normalized={url:link.url,title:row.title.trim(),mergedAt:new Date(row.mergedAt).toISOString(),authorLogin:row.authorLogin,coauthors,evidence:row.evidence};
      if(row.commitSha) normalized.commitSha=row.commitSha.toLowerCase();
      const identity=link.url.toLowerCase();
      if(seen.has(identity)){duplicates++;return;}seen.add(identity);rows.push(normalized);
    });
    rows.sort((a,b)=>new Date(b.mergedAt)-new Date(a.mergedAt));
    return {dataset:{schemaVersion:1,player:data.player,source:data.source,scannedAt:new Date(data.scannedAt).toISOString(),coverage:{complete:false,scope:data.coverage.scope.trim(),truncated:data.coverage.truncated!==false},pullRequests:rows},duplicates};
  }
  function eligible(row,player) {
    const who=player.toLowerCase();const names=row.coauthors.map(v=>v.toLowerCase());
    if(row.evidence==='linked-authors') return names.includes(who) && names.some(v=>v!==who);
    return row.authorLogin.toLowerCase()===who && names.some(v=>v!==who);
  }
  function save() {
    try{localStorage.setItem(STORE,JSON.stringify(state));storageFailed=false;}catch{storageFailed=true;}
    $('storage-warning').hidden=!storageFailed;
    $('storage-warning').textContent=t('storageWarning');
    if(storageFailed) showStatus('storageWarning',{},'error');
  }
  try {
    const raw=localStorage.getItem(STORE);
    if(raw && raw.length<=MAX_BYTES*2) {
      const saved=JSON.parse(raw);
      if(saved && typeof saved==='object') {
        state.lang=saved.lang==='ko'?'ko':'en';
        state.username=loginOK(saved.username)?saved.username:'';
        if(Array.isArray(saved.checklist)&&saved.checklist.length===5) state.checklist=saved.checklist.map(v=>v===true);
        if(saved.dataset){state.dataset=normalizeDataset(saved.dataset).dataset;state.origin=['imported','scanned','demo'].includes(saved.origin)?saved.origin:'imported';}
      }
    }
  } catch { storageFailed=true; }
  function node(tag,className,text) { const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el; }
  function showStatus(key,args={},tone='') {currentStatus={key,args,tone};$('status').textContent=t(key,args);$('status').dataset.tone=tone;}
  function formatDate(value) {return new Intl.DateTimeFormat(state.lang==='ko'?'ko-KR':'en',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}
  function renderRate() {
    $('rate-limit').hidden=!rate;
    if(rate) $('rate-limit').textContent=rate.remaining!==null?t('rateInfo',{remaining:rate.remaining,limit:rate.limit,reset:rate.reset?formatDate(rate.reset):'?'}):t('rateUnknown');
  }
  function renderLanguage() {
    document.documentElement.lang=state.lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
    $('language').textContent=state.lang==='en'?'한국어':'English';
    $('language').setAttribute('aria-label',state.lang==='en'?'Switch to Korean':'영어로 전환');
    $('username').placeholder=state.lang==='en'?'e.g. Reasonofmoon':'예: Reasonofmoon';
    showStatus(currentStatus.key,currentStatus.args,currentStatus.tone);
    $('storage-warning').hidden=!storageFailed;
    $('storage-warning').textContent=t('storageWarning');
    renderRate();
  }
  function setBusy(busy) {
    $('scan-button').disabled=busy;
    $('username').disabled=busy;
    $('demo-button').disabled=busy;
    $('import-button').disabled=busy;
    $('cancel-button').hidden=!activeScan;
    $('cancel-button').disabled=Boolean(activeScan?.cancelled);
    $('export-button').disabled=busy||!state.dataset;
    $('clear-button').disabled=busy||!state.dataset;
  }
  function renderQuest() {
    $('quest-list').replaceChildren();
    state.checklist.forEach((checked,i)=>{
      const label=node('label','quest-row');const input=node('input');input.type='checkbox';input.checked=checked;
      input.addEventListener('change',()=>{state.checklist[i]=input.checked;save();renderQuestProgress();if(state.checklist.every(Boolean)&&input.checked){$('quest-list').classList.remove('celebrate');void $('quest-list').offsetWidth;$('quest-list').classList.add('celebrate');}});
      const texts=node('span');texts.append(node('strong','',t('q'+(i+1))),node('small','',t('q'+(i+1)+'sub')));label.append(input,texts);$('quest-list').append(label);
    });renderQuestProgress();
  }
  function renderQuestProgress() {$('quest-progress').textContent=t('questProgress',{n:state.checklist.filter(Boolean).length});}
  function render() {
    const dataset=state.dataset;const rows=dataset?.pullRequests||[];const valid=dataset?rows.filter(r=>eligible(r,dataset.player)):[];
    const count=valid.length;const xp=count*100;
    $('pr-count').textContent=String(count);$('xp-count').replaceChildren(document.createTextNode(String(xp)+' '),node('small','','XP'));
    $('level-count').textContent=String(1+Math.floor(xp/300));$('level-bar').style.width=(xp%300/3)+'%';$('level-caption').textContent=t('levelProgress',{n:xp%300});
    $('pr-caption').textContent=!dataset?t('noData'):dataset.source==='demo'?t('demoCaption'):t('caption',{linked:valid.filter(r=>r.evidence==='linked-authors').length,candidate:valid.filter(r=>r.evidence==='trailer-candidate').length});
    const next=[1,10,24,48].find(goal=>goal>count);
    $('ladder').replaceChildren();
    [1,10,24,48].forEach(goal=>{const rung=node('div','rung'+(count>=goal?' reached':next===goal?' next':''));const gem=node('div','pixel-gem');gem.setAttribute('aria-hidden','true');rung.append(gem,node('strong','',String(goal)),node('span','',t('prLabel')),node('span','',t(count>=goal?'reached':next===goal?'next':'later')));$('ladder').append(rung);});
    $('goal-label').textContent=t(next?'goal':'goalsDone');$('goal-text').textContent=!dataset?t('zeroGoal'):next?t('goalRemaining',{n:next-count,goal:next}):t('allGoals');
    $('dataset-notice').hidden=!dataset;
    if(dataset){const kind=dataset.source==='demo'?'demo':state.origin==='imported'?'imported':'rest';$('dataset-notice').dataset.kind=kind;$('notice-title').textContent=t(kind==='imported'?'importTitle':kind+'Title');$('notice-description').textContent=t(kind==='demo'?'demoNotice':kind==='imported'?'importNotice':'restNotice');}
    renderEvidence();renderQuest();setBusy(Boolean(activeScan)||importBusy);renderRate();
  }
  function renderEvidence() {
    const dataset=state.dataset;const query=$('evidence-search').value.trim().toLowerCase();const filter=$('evidence-filter').value;
    const rows=(dataset?.pullRequests||[]).filter(r=>(filter==='all'||r.evidence===filter)&&r.title.toLowerCase().includes(query));
    $('evidence-list').replaceChildren();
    if(!rows.length){const empty=node('div','empty-state');const symbol=node('span','empty-symbol');symbol.setAttribute('aria-hidden','true');const key=!dataset?'empty':dataset.pullRequests.length===0?'emptyScan':'noResults';empty.append(symbol,node('h3','',t(key==='empty'?'emptyTitle':key==='emptyScan'?'emptyScan':'noResults')),node('p','',t(key+'Body')));$('evidence-list').append(empty);}
    rows.forEach(row=>{
      const demo=dataset.source==='demo';const qualifies=eligible(row,dataset.player);const candidate=row.evidence==='trailer-candidate';
      const card=node('article','pr-card');const top=node('div','pr-card-top');
      if(demo)top.append(node('span','badge demo',t('demoTag')));else if(state.origin==='imported')top.append(node('span','badge',t('importTag')));
      top.append(node('span','badge'+(candidate?' candidate':''),t(candidate?'candidateTag':'linkedTag')));
      if(!qualifies)top.append(node('span','badge ineligible',t('excluded')));
      const heading=node('h3');if(demo){heading.textContent=row.title;}else{const anchor=node('a','',row.title);anchor.href=row.url;anchor.target='_blank';anchor.rel='noopener noreferrer';heading.append(anchor);}
      const meta=node('div','pr-meta');const link=prURL(row.url);meta.append(node('span','',link.owner+'/'+link.repo+' #'+link.number),node('span','',t('merged')+': '+new Intl.DateTimeFormat(state.lang==='ko'?'ko-KR':'en',{dateStyle:'medium'}).format(new Date(row.mergedAt))));
      const details=node('details');details.append(node('summary','',t('evidenceDetails')));
      details.append(node('p','',t(candidate?'author':'prAuthor')+': '+(row.authorLogin||(state.lang==='ko'?'탈퇴 또는 알 수 없음':'Deleted or unknown'))),node('p','',t('coauthors')+': '+(row.coauthors.join(', ')||(state.lang==='ko'?'없음':'None'))));
      details.append(node('p','',t(demo?'demoExplain':candidate?'candidateExplain':'linkedExplain')));
      if(!qualifies)details.append(node('p','',t('excludedExplain')));
      if(row.commitSha){const sha=node('p','',t('commit')+': ');sha.append(node('code','',row.commitSha));details.append(sha);}
      if(demo)details.append(node('p','',row.url));card.append(top,heading,meta,details);$('evidence-list').append(card);
    });
    $('dataset-meta').hidden=!dataset;
    if(dataset)$('dataset-meta').textContent=t('datasetMeta',{player:dataset.player,rows:dataset.pullRequests.length,date:formatDate(dataset.scannedAt),scope:dataset.coverage.scope});
  }
  function replaceDataset(dataset,origin) {state.dataset=dataset;state.origin=origin;state.username=dataset.player;$('username').value=state.username;$('username').removeAttribute('aria-invalid');$('evidence-search').value='';$('evidence-filter').value='all';save();render();}
  function loadDemo() {
    const titles=['Make the setup guide work for first-time contributors','Fix keyboard focus in the settings panel','Add regression tests for shared drafts','Improve error messages for offline users','Document the contributor review checklist'];
    const rows=titles.map((title,i)=>({url:'https://github.com/demo-player/demo-repo/pull/'+(i+1),title,mergedAt:'2026-10-'+String(20+i).padStart(2,'0')+'T12:00:00.000Z',authorLogin:'demo-player',coauthors:i===3?['Sample Teammate']:['demo-player','demo-teammate'],evidence:i===3?'trailer-candidate':'linked-authors'}));
    replaceDataset({schemaVersion:1,player:'demo-player',source:'demo',scannedAt:new Date().toISOString(),coverage:{complete:false,scope:copy.en.demoScope},pullRequests:rows.reverse()},'demo');showStatus('demoLoaded',{},'success');
  }
  async function importFile(file) {
    if(!file || activeScan || importBusy)return;
    importBusy=true;setBusy(true);showStatus('importing',{},'working');
    try{
      if(file.size>MAX_BYTES)fail('importLimit');const text=await file.text();if(new TextEncoder().encode(text).length>MAX_BYTES)fail('importLimit');
      let parsed;try{parsed=JSON.parse(text);}catch{fail('badJSON');}
      const result=normalizeDataset(parsed);replaceDataset(result.dataset,'imported');showStatus('imported',{rows:result.dataset.pullRequests.length,eligible:result.dataset.pullRequests.filter(r=>eligible(r,result.dataset.player)).length,duplicates:result.duplicates},'success');
    }catch(error){showStatus('invalidImport',{reason:t(error.key||'badSchema',error.args)},'error');}
    finally{importBusy=false;setBusy(false);$('import-file').value='';}
  }
  function exportEvidence() {
    if(!state.dataset)return;
    const dataset=normalizeDataset(state.dataset).dataset;const blob=new Blob([JSON.stringify(dataset,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const anchor=node('a');anchor.href=url;anchor.download='coop-quest-'+dataset.player+'-'+dataset.scannedAt.slice(0,10)+'.json';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showStatus('exported',{},'success');
  }
  function errorReason(error){return error.key?t(error.key,error.args):t('networkError');}
  async function api(endpoint,job) {
    if(job.controller.signal.aborted)throw new DOMException('Aborted','AbortError');
    const controller=new AbortController();let timedOut=false;
    const abort=()=>controller.abort();job.controller.signal.addEventListener('abort',abort,{once:true});
    const timeout=setTimeout(()=>{timedOut=true;controller.abort();},25000);
    try{
      const response=await fetch('https://api.github.com'+endpoint,{method:'GET',headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal});
      const remaining=response.headers.get('x-ratelimit-remaining');const limit=response.headers.get('x-ratelimit-limit');const reset=response.headers.get('x-ratelimit-reset');
      const newRate={remaining:remaining!==null&&/^\d+$/.test(remaining)?Number(remaining):null,limit:limit&&/^\d+$/.test(limit)?Number(limit):'?',reset:reset&&/^\d+$/.test(reset)?new Date(Number(reset)*1000).toISOString():null};
      if(!rate || newRate.remaining===null || (newRate.reset!==rate.reset) || newRate.remaining<=rate.remaining)rate=newRate;renderRate();
      if(response.status===403||response.status===429){const error=new Error('rateError');error.key='rateError';job.fatal=error;job.controller.abort();throw error;}
      if(!response.ok){const error=new Error('httpError');error.key='httpError';error.args={status:response.status};throw error;}
      return await response.json();
    }catch(error){if(timedOut&&!job.controller.signal.aborted){const failure=new Error('timeoutError');failure.key='timeoutError';throw failure;}throw error;}
    finally{clearTimeout(timeout);job.controller.signal.removeEventListener('abort',abort);}
  }
  function trailerNames(message) {
    if(typeof message!=='string')return [];
    const names=[];const seen=new Set();const regex=/^Co-authored-by:\s*([^\r\n<>]+?)\s*<[^>\r\n]+>\s*$/gmi;let match;
    while((match=regex.exec(message))!==null){const name=match[1].trim();if(plain(name,80)&&!/[<>@]/.test(name)&&!seen.has(name.toLowerCase())){seen.add(name.toLowerCase());names.push(name);}if(names.length===100)break;}
    return names;
  }
  async function scan(player) {
    const previousDataset=state.dataset;
    const job={controller:new AbortController(),rows:[],inspected:0,total:0,reported:0,errors:0,cancelled:false,fatal:null};activeScan=job;rate=null;setBusy(true);renderRate();showStatus('scanning',{player},'working');
    try {
      const query='is:pr is:merged author:'+player+' is:public';
      const search=await api('/search/issues?q='+encodeURIComponent(query)+'&sort=updated&order=desc&per_page=20&page=1',job);
      if(!Array.isArray(search.items))fail('networkError');
      job.reported=Number.isSafeInteger(search.total_count)?search.total_count:search.items.length;
      const items=search.items.slice(0,20).filter(item=>item.pull_request&&prURL(item.html_url));job.total=items.length;
      let cursor=0;
      async function worker() {
        while(cursor<items.length&&!job.controller.signal.aborted){const item=items[cursor++];const link=prURL(item.html_url);const base='/repos/'+encodeURIComponent(link.owner)+'/'+encodeURIComponent(link.repo)+'/pulls/'+link.number;
          try{
            const pull=await api(base,job);if(!pull.merged_at||!dateOK(pull.merged_at))continue;
            const commits=await api(base+'/commits?per_page=100&page=1',job);if(!Array.isArray(commits))fail('networkError');
            for(const commit of commits.slice(0,100)){
              if(typeof commit.author?.login!=='string'||commit.author.login.toLowerCase()!==player.toLowerCase())continue;
              const coauthors=trailerNames(commit.commit?.message).filter(name=>name.toLowerCase()!==player.toLowerCase());if(!coauthors.length)continue;
              const row={url:link.url,title:typeof pull.title==='string'?pull.title:item.title,mergedAt:pull.merged_at,authorLogin:commit.author.login,coauthors,evidence:'trailer-candidate'};
              if(typeof commit.sha==='string'&&/^[a-f\d]{7,64}$/i.test(commit.sha))row.commitSha=commit.sha;
              // Validate public responses with exactly the same rules as imported evidence.
              const safe=normalizeDataset({schemaVersion:1,player,source:'public-rest',scannedAt:new Date().toISOString(),coverage:{complete:false,scope:'Public REST candidate'},pullRequests:[row]}).dataset.pullRequests[0];
              job.rows.push(safe);break;
            }
            job.inspected++;
          } catch(error){if(job.controller.signal.aborted)break;job.errors++;}
          if(!job.controller.signal.aborted)showStatus('inspecting',{done:job.inspected,total:job.total,found:job.rows.length},'working');
        }
      }
      await Promise.all([worker(),worker()]);
    }catch(error){if(!job.cancelled&&!job.fatal)job.fatal=error;}
    finally{
      const scope=copy.en.scanScope.replace(/\{(\w+)\}/g,(_,key)=>String({player,done:job.inspected,total:job.total,reported:job.reported,errors:job.errors}[key]));
      const dataset=normalizeDataset({schemaVersion:1,player,source:'public-rest',scannedAt:new Date().toISOString(),coverage:{complete:false,scope:scope+(job.cancelled?' Cancelled by user.':job.fatal?' Stopped early due to an API or network error.':'')},pullRequests:job.rows}).dataset;
      const keptPrevious=Boolean(previousDataset && (job.cancelled||job.fatal||job.errors) && dataset.pullRequests.length===0);
      activeScan=null;if(keptPrevious){render();}else{replaceDataset(dataset,'scanned');}
      if(job.fatal)showStatus('scanFailed',{reason:errorReason(job.fatal)},'error');
      else if(job.cancelled)showStatus('cancelled',{found:dataset.pullRequests.length},'');
      else if(job.errors)showStatus('partial',{found:dataset.pullRequests.length,errors:job.errors},'error');
      else showStatus('completed',{found:dataset.pullRequests.length,done:job.inspected},'success');
      if(keptPrevious)showStatus(job.cancelled?'keptAfterCancel':'keptAfterFailure',{reason:job.fatal?errorReason(job.fatal):t('networkError')},job.cancelled?'':'error');
      setBusy(false);
    }
  }
  $('scan-form').addEventListener('submit',event=>{
    event.preventDefault();if(activeScan||importBusy)return;const player=$('username').value.trim();
    if(!loginOK(player)){$('username').setAttribute('aria-invalid','true');showStatus('invalidUsername',{},'error');$('username').focus();return;}
    $('username').removeAttribute('aria-invalid');state.username=player;scan(player);
  });
  $('cancel-button').addEventListener('click',()=>{if(activeScan){activeScan.cancelled=true;activeScan.controller.abort();$('cancel-button').disabled=true;}});
  $('demo-button').addEventListener('click',loadDemo);
  $('import-button').addEventListener('click',()=>$('import-file').click());
  $('import-file').addEventListener('change',()=>importFile($('import-file').files[0]));
  $('export-button').addEventListener('click',exportEvidence);
  $('clear-button').addEventListener('click',()=>{state.dataset=null;state.origin=null;save();render();showStatus('cleared',{},'success');});
  $('reset-quest').addEventListener('click',()=>{state.checklist=[false,false,false,false,false];save();renderQuest();showStatus('resetDone',{},'success');});
  $('evidence-search').addEventListener('input',renderEvidence);
  $('evidence-filter').addEventListener('change',renderEvidence);
  $('language').addEventListener('click',()=>{state.lang=state.lang==='en'?'ko':'en';save();renderLanguage();render();});
  $('username').addEventListener('input',()=>{$('username').removeAttribute('aria-invalid');});
  $('username').value=state.username;
  renderLanguage();render();
  if(storageFailed)showStatus('storageWarning',{},'error');
})();
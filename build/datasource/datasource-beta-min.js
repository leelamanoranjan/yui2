YAHOO.util.DataSource=function(B,D){if(!B){return ;}this.liveData=B;this._oQueue={interval:null,conn:null,requests:[]};if(B.nodeType&&B.nodeType==9){this.dataType=YAHOO.util.DataSource.TYPE_XML;}else{if(YAHOO.lang.isArray(B)){this.dataType=YAHOO.util.DataSource.TYPE_JSARRAY;}else{if(YAHOO.lang.isString(B)){this.dataType=YAHOO.util.DataSource.TYPE_XHR;}else{if(YAHOO.lang.isFunction(B)){this.dataType=YAHOO.util.DataSource.TYPE_JSFUNCTION;}else{if(B.nodeName&&(B.nodeName.toLowerCase()=="table")){this.dataType=YAHOO.util.DataSource.TYPE_HTMLTABLE;this.liveData=B.cloneNode(true);}else{if(YAHOO.lang.isObject(B)){this.dataType=YAHOO.util.DataSource.TYPE_JSON;}else{this.dataType=YAHOO.util.DataSource.TYPE_UNKNOWN;}}}}}}if(D&&(D.constructor==Object)){for(var C in D){if(C){this[C]=D[C];}}}var A=this.maxCacheEntries;if(!YAHOO.lang.isNumber(A)||(A<0)){A=0;}this._aIntervals=[];this._sName="DataSource instance"+YAHOO.util.DataSource._nIndex;YAHOO.util.DataSource._nIndex++;this.createEvent("cacheRequestEvent");this.createEvent("cacheResponseEvent");this.createEvent("requestEvent");this.createEvent("responseEvent");this.createEvent("responseParseEvent");this.createEvent("responseCacheEvent");this.createEvent("dataErrorEvent");this.createEvent("cacheFlushEvent");};YAHOO.augment(YAHOO.util.DataSource,YAHOO.util.EventProvider);YAHOO.util.DataSource.TYPE_UNKNOWN=-1;YAHOO.util.DataSource.TYPE_JSARRAY=0;YAHOO.util.DataSource.TYPE_JSFUNCTION=1;YAHOO.util.DataSource.TYPE_XHR=2;YAHOO.util.DataSource.TYPE_JSON=3;YAHOO.util.DataSource.TYPE_XML=4;YAHOO.util.DataSource.TYPE_TEXT=5;YAHOO.util.DataSource.TYPE_HTMLTABLE=6;YAHOO.util.DataSource.ERROR_DATAINVALID="Invalid data";YAHOO.util.DataSource.ERROR_DATANULL="Null data";YAHOO.util.DataSource._nIndex=0;YAHOO.util.DataSource._nTransactionId=0;YAHOO.util.DataSource.prototype._sName=null;YAHOO.util.DataSource.prototype._aCache=null;YAHOO.util.DataSource.prototype._oQueue=null;YAHOO.util.DataSource.prototype._aIntervals=null;YAHOO.util.DataSource.prototype.maxCacheEntries=0;YAHOO.util.DataSource.prototype.liveData=null;YAHOO.util.DataSource.prototype.dataType=YAHOO.util.DataSource.TYPE_UNKNOWN;YAHOO.util.DataSource.prototype.responseType=YAHOO.util.DataSource.TYPE_UNKNOWN;YAHOO.util.DataSource.prototype.responseSchema=null;YAHOO.util.DataSource.prototype.connMgr=null;YAHOO.util.DataSource.prototype.connXhrMode="allowAll";YAHOO.util.DataSource.prototype.connMethodPost=false;YAHOO.util.DataSource.prototype.connTimeout=0;YAHOO.util.DataSource.parseString=function(B){if(!YAHOO.lang.isValue(B)){return null;}var A=B+"";if(YAHOO.lang.isString(A)){return A;}else{return null;}};YAHOO.util.DataSource.parseNumber=function(B){var A=B*1;if(YAHOO.lang.isNumber(A)){return A;}else{return null;}};YAHOO.util.DataSource.convertNumber=function(A){return YAHOO.util.DataSource.parseNumber(A);};YAHOO.util.DataSource.parseDate=function(B){var A=null;if(!(B instanceof Date)){A=new Date(B);}else{return B;}if(A instanceof Date){return A;}else{return null;}};YAHOO.util.DataSource.convertDate=function(A){return YAHOO.util.DataSource.parseDate(A);};YAHOO.util.DataSource.prototype.toString=function(){return this._sName;};YAHOO.util.DataSource.prototype.getCachedResponse=function(H,B,G){var A=this._aCache;if(this.maxCacheEntries>0){if(!A){this._aCache=[];}else{var D=A.length;if(D>0){var F=null;this.fireEvent("cacheRequestEvent",{request:H,callback:B,caller:G});for(var E=D-1;E>=0;E--){var C=A[E];if(this.isCacheHit(H,C.request)){F=C.response;this.fireEvent("cacheResponseEvent",{request:H,response:F,callback:B,caller:G});if(E<D-1){A.splice(E,1);this.addToCache(H,F);}break;}}return F;}}}else{if(A){this._aCache=null;}}return null;};YAHOO.util.DataSource.prototype.isCacheHit=function(A,B){return(A===B);};YAHOO.util.DataSource.prototype.addToCache=function(D,C){var A=this._aCache;if(!A){return ;}while(A.length>=this.maxCacheEntries){A.shift();}var B={request:D,response:C};A[A.length]=B;this.fireEvent("responseCacheEvent",{request:D,response:C});};YAHOO.util.DataSource.prototype.flushCache=function(){if(this._aCache){this._aCache=[];this.fireEvent("cacheFlushEvent");}};YAHOO.util.DataSource.prototype.setInterval=function(D,F,B,E){if(YAHOO.lang.isNumber(D)&&(D>=0)){var C=this;var A=setInterval(function(){C.makeConnection(F,B,E);},D);this._aIntervals.push(A);return A;}else{}};YAHOO.util.DataSource.prototype.clearInterval=function(A){var C=this._aIntervals||[];for(var B=C.length-1;B>-1;B--){if(C[B]===A){C.splice(B,1);clearInterval(A);}}};YAHOO.util.DataSource.prototype.clearAllIntervals=function(A){var C=this._aIntervals||[];for(var B=C.length-1;B>-1;B--){C.splice(B,1);clearInterval(A);}};YAHOO.util.DataSource.issueCallback=function(E,D,B,C){if(YAHOO.lang.isFunction(E)){E.apply(C,D);}else{if(YAHOO.lang.isObject(E)){C=E.scope||C||window;var A=E.success;if(B){A=E.failure;}if(A){A.apply(C,D.concat([E.argument]));}}}};YAHOO.util.DataSource.prototype.sendRequest=function(D,A,C){var B=this.getCachedResponse(D,A,C);if(B){YAHOO.util.DataSource.issueCallback(A,[D,B],false,C);return null;}return this.makeConnection(D,A,C);};YAHOO.util.DataSource.prototype.makeConnection=function(A,P,K){this.fireEvent("requestEvent",{request:A,callback:P,caller:K});var D=null;var L=YAHOO.util.DataSource._nTransactionId++;switch(this.dataType){case YAHOO.util.DataSource.TYPE_JSFUNCTION:D=this.liveData(A);this.handleResponse(A,D,P,K,L);break;case YAHOO.util.DataSource.TYPE_XHR:var N=this;var C=this.connMgr||YAHOO.util.Connect;var G=this._oQueue;var J=function(Q){if(Q&&(this.connXhrMode=="ignoreStaleResponses")&&(Q.tId!=G.conn.tId)){return null;}else{if(!Q){this.fireEvent("dataErrorEvent",{request:A,callback:P,caller:K,message:YAHOO.util.DataSource.ERROR_DATANULL});YAHOO.util.DataSource.issueCallback(P,[A,{error:true}],true,K);return null;}else{this.handleResponse(A,Q,P,K,L);}}};var O=function(Q){this.fireEvent("dataErrorEvent",{request:A,callback:P,caller:K,message:YAHOO.util.DataSource.ERROR_DATAINVALID});if((this.liveData.lastIndexOf("?")!==this.liveData.length-1)&&(A.indexOf("?")!==0)){}Q=Q||{};
Q.error=true;YAHOO.util.DataSource.issueCallback(P,[A,Q],true,K);return null;};var I={success:J,failure:O,scope:this};if(YAHOO.lang.isNumber(this.connTimeout)){I.timeout=this.connTimeout;}if(this.connXhrMode=="cancelStaleRequests"){if(G.conn){if(C.abort){C.abort(G.conn);G.conn=null;}else{}}}if(C&&C.asyncRequest){var B=this.liveData;var H=this.connMethodPost;var M=(H)?"POST":"GET";var E=(H)?B:B+A;var F=(H)?A:null;if(this.connXhrMode!="queueRequests"){G.conn=C.asyncRequest(M,E,I,F);}else{if(G.conn){G.requests.push({request:A,callback:I});if(!G.interval){G.interval=setInterval(function(){if(C.isCallInProgress(G.conn)){return ;}else{if(G.requests.length>0){E=(H)?B:B+G.requests[0].request;F=(H)?G.requests[0].request:null;G.conn=C.asyncRequest(M,E,G.requests[0].callback,F);G.requests.shift();}else{clearInterval(G.interval);G.interval=null;}}},50);}}else{G.conn=C.asyncRequest(M,E,I,F);}}}else{YAHOO.util.DataSource.issueCallback(P,[A,{error:true}],true,K);}break;default:D=this.liveData;this.handleResponse(A,D,P,K,L);break;}return L;};YAHOO.util.DataSource.prototype.handleResponse=function(oRequest,oRawResponse,oCallback,oCaller,tId){this.fireEvent("responseEvent",{request:oRequest,response:oRawResponse,callback:oCallback,caller:oCaller,tId:tId});var xhr=(this.dataType==YAHOO.util.DataSource.TYPE_XHR)?true:false;var oParsedResponse=null;var oFullResponse=oRawResponse;switch(this.responseType){case YAHOO.util.DataSource.TYPE_JSARRAY:if(xhr&&oRawResponse.responseText){oFullResponse=oRawResponse.responseText;}oFullResponse=this.doBeforeParseData(oRequest,oFullResponse);oParsedResponse=this.parseArrayData(oRequest,oFullResponse);break;case YAHOO.util.DataSource.TYPE_JSON:if(xhr&&oRawResponse.responseText){oFullResponse=oRawResponse.responseText;}if(YAHOO.lang.isString(oFullResponse)){if(YAHOO.lang.JSON){oFullResponse=YAHOO.lang.JSON.parse(oFullResponse);}else{if(window.JSON&&JSON.parse){oFullResponse=JSON.parse(oFullResponse);}else{if(oFullResponse.parseJSON){oFullResponse=oFullResponse.parseJSON();}else{try{while(oFullResponse.length>0&&(oFullResponse.charAt(0)!="{")&&(oFullResponse.charAt(0)!="[")){oFullResponse=oFullResponse.substring(1,oFullResponse.length);}if(oFullResponse.length>0){var objEnd=Math.max(oFullResponse.lastIndexOf("]"),oFullResponse.lastIndexOf("}"));oFullResponse=oFullResponse.substring(0,objEnd+1);oFullResponse=eval("("+oFullResponse+")");}}catch(e){}}}}}oFullResponse=this.doBeforeParseData(oRequest,oFullResponse);oParsedResponse=this.parseJSONData(oRequest,oFullResponse);break;case YAHOO.util.DataSource.TYPE_HTMLTABLE:if(xhr&&oRawResponse.responseText){oFullResponse=oRawResponse.responseText;}oFullResponse=this.doBeforeParseData(oRequest,oFullResponse);oParsedResponse=this.parseHTMLTableData(oRequest,oFullResponse);break;case YAHOO.util.DataSource.TYPE_XML:if(xhr&&oRawResponse.responseXML){oFullResponse=oRawResponse.responseXML;}oFullResponse=this.doBeforeParseData(oRequest,oFullResponse);oParsedResponse=this.parseXMLData(oRequest,oFullResponse);break;case YAHOO.util.DataSource.TYPE_TEXT:if(xhr&&oRawResponse.responseText){oFullResponse=oRawResponse.responseText;}oFullResponse=this.doBeforeParseData(oRequest,oFullResponse);oParsedResponse=this.parseTextData(oRequest,oFullResponse);break;default:oFullResponse=this.doBeforeParseData(oRequest,oFullResponse);oParsedResponse=this.doBeforeParseData(oRequest,oFullResponse);break;}if(oParsedResponse&&!oParsedResponse.error){oParsedResponse=this.doBeforeCallback(oRequest,oFullResponse,oParsedResponse);this.fireEvent("responseParseEvent",{request:oRequest,response:oParsedResponse,callback:oCallback,caller:oCaller});this.addToCache(oRequest,oParsedResponse);}else{this.fireEvent("dataErrorEvent",{request:oRequest,response:oRawResponse,callback:oCallback,caller:oCaller,message:YAHOO.util.DataSource.ERROR_DATANULL});oParsedResponse=oParsedResponse||{};oParsedResponse.error=true;}oParsedResponse.tId=tId;YAHOO.util.DataSource.issueCallback(oCallback,[oRequest,oParsedResponse],oParsedResponse.error,oCaller);};YAHOO.util.DataSource.prototype.doBeforeParseData=function(B,A){return A;};YAHOO.util.DataSource.prototype.doBeforeCallback=function(B,A,C){return C;};YAHOO.util.DataSource.prototype.parseArrayData=function(A,H){if(YAHOO.lang.isArray(H)){if(YAHOO.lang.isArray(this.responseSchema.fields)){var J={results:[]};var F=this.responseSchema.fields;for(var D=H.length-1;D>-1;D--){var E={};for(var B=F.length-1;B>-1;B--){var G=F[B];var I=(YAHOO.lang.isValue(G.key))?G.key:G;var C=(YAHOO.lang.isValue(H[D][B]))?H[D][B]:H[D][I];if(!G.parser&&G.converter){G.parser=G.converter;}if(G.parser){C=G.parser.call(this,C);}if(C===undefined){C=null;}E[I]=C;}J.results.unshift(E);}return J;}}return null;};YAHOO.util.DataSource.prototype.parseTextData=function(A,N){if(YAHOO.lang.isString(N)){if(YAHOO.lang.isArray(this.responseSchema.fields)&&YAHOO.lang.isString(this.responseSchema.recordDelim)&&YAHOO.lang.isString(this.responseSchema.fieldDelim)){var P={results:[]};var L=this.responseSchema.recordDelim;var F=this.responseSchema.fieldDelim;var I=this.responseSchema.fields;if(N.length>0){var B=N.length-L.length;if(N.substr(B)==L){N=N.substr(0,B);}var Q=N.split(L);for(var E=Q.length-1;E>-1;E--){var H={};var J=false;if(YAHOO.lang.isString(Q[E])){var G=Q[E].split(F);for(var C=I.length-1;C>-1;C--){try{var D=G[C];if(YAHOO.lang.isString(D)){if(D.charAt(0)=="\""){D=D.substr(1);}if(D.charAt(D.length-1)=="\""){D=D.substr(0,D.length-1);}var M=I[C];var O=(YAHOO.lang.isValue(M.key))?M.key:M;if(!M.parser&&M.converter){M.parser=M.converter;}if(M.parser){D=M.parser.call(this,D);}if(D===undefined){D=null;}H[O]=D;}else{J=true;}}catch(K){J=true;}}if(!J){P.results.unshift(H);}}}}return P;}}return null;};YAHOO.util.DataSource.prototype.parseXMLData=function(A,K){var H=false;var N={};var C=null;try{C=(this.responseSchema.resultNode)?K.getElementsByTagName(this.responseSchema.resultNode):null;}catch(I){}if(!C||!YAHOO.lang.isArray(this.responseSchema.fields)){H=true;}else{N.results=[];for(var E=C.length-1;
E>=0;E--){var O=C.item(E);var G={};for(var D=this.responseSchema.fields.length-1;D>=0;D--){var J=this.responseSchema.fields[D];var M=(YAHOO.lang.isValue(J.key))?J.key:J;var F=null;var B=O.attributes.getNamedItem(M);if(B){F=B.value;}else{var L=O.getElementsByTagName(M);if(L&&L.item(0)&&L.item(0).firstChild){F=L.item(0).firstChild.nodeValue;}else{F="";}}if(!J.parser&&J.converter){J.parser=J.converter;}if(J.parser){F=J.parser.call(this,F);}if(F===undefined){F=null;}G[M]=F;}N.results.unshift(G);}}if(H){N.error=true;}else{}return N;};YAHOO.util.DataSource.prototype.executeJSONParser=function(G){if(!this.jsonResponseParser){var A=this.responseSchema,D=A.fields,C=A.resultsList,E=A.totalRecords,I=[],F,B;if(/\(/.test(C)){throw new SyntaxError("resultsList may only contain valid characters for variable names");}var H="var results=oFullResponse."+C+";";H+="if(!results){results=[];}if(!YAHOO.lang.isArray(results)){results=[results];}";for(B=D.length-1;B>=0;--B){I[B]=typeof D[B]==="object"?D[B].key:D[B];}if(/\[|\./.test(I.join(""))){H+="for(var i=results.length-1;i>=0;--i){var r=results[i];results[i]={";F=[];for(B=I.length-1;B>=0;--B){F[B]="\""+I[B].replace(/"/g,"\\\"")+"\":r."+I[B];}H+=F.join(",")+"};}";}H+="return {results:results";if(E){H+=",totalRecords:oFullResponse."+E;}H+="};";this.jsonResponseParser=new Function("oFullResponse",H);}return this.jsonResponseParser(G);};YAHOO.util.DataSource.prototype.parseJSONData=function(D,J){var M={results:[]};if(J&&(J.constructor==Object)){if(YAHOO.lang.isArray(this.responseSchema.fields)){var F=this.responseSchema.fields,L={},H=false,G=false,E;for(E=F.length-1;E>=0;--E){var K=F[E].key||F[E],B=F[E].parser||F[E].converter;if(B){L[K]=B;G=true;}}try{M=this.executeJSONParser(J);}catch(I){H=true;}if(H||!M||!M.results){if(!M){M={results:[]};}M.error=true;}if(G){for(E=M.results.length-1;E>=0;--E){var A=M.results[E];for(var C in L){if(YAHOO.lang.hasOwnProperty(L,C)){A[C]=L[C].call(this,A[C]);if(A[C]===undefined){A[C]=null;}}}}}}}else{M.error=true;}return M;};YAHOO.util.DataSource.prototype.parseHTMLTableData=function(B,M){var J=false;var K=M;var I=this.responseSchema.fields;var O={results:[]};for(var G=0;G<K.tBodies.length;G++){var C=K.tBodies[G];for(var E=C.rows.length-1;E>-1;E--){var A=C.rows[E];var H={};for(var D=I.length-1;D>-1;D--){var L=I[D];var N=(YAHOO.lang.isValue(L.key))?L.key:L;var F=A.cells[D].innerHTML;if(!L.parser&&L.converter){L.parser=L.converter;}if(L.parser){F=L.parser.call(this,F);}if(F===undefined){F=null;}H[N]=F;}O.results.unshift(H);}}if(J){O.error=true;}else{}return O;};YAHOO.util.Number={format:function(B,E){E=E||{};if(!YAHOO.lang.isNumber(B)){B*=1;}if(YAHOO.lang.isNumber(B)){var I=B+"";var F=(E.decimalSeparator)?E.decimalSeparator:".";var G;if(YAHOO.lang.isNumber(E.decimalPlaces)){var H=E.decimalPlaces;var C=Math.pow(10,H);I=Math.round(B*C)/C+"";G=I.lastIndexOf(".");if(H>0){if(G<0){I+=F;G=I.length-1;}else{if(F!=="."){I=I.replace(".",F);}}while((I.length-1-G)<H){I+="0";}}}if(E.thousandsSeparator){var K=E.thousandsSeparator;G=I.lastIndexOf(F);G=(G>-1)?G:I.length;var J=I.substring(G);var A=-1;for(var D=G;D>0;D--){A++;if((A%3===0)&&(D!==G)){J=K+J;}J=I.charAt(D-1)+J;}I=J;}I=(E.prefix)?E.prefix+I:I;I=(E.suffix)?I+E.suffix:I;return I;}else{return B;}}};YAHOO.util.Date={format:function(C,B){B=B||{};if(C instanceof Date){var D=B.format||"MM/DD/YYYY";var E=C.getMonth()+1;var A=C.getDate();var F=C.getFullYear();switch(D){case"YYYY/MM/DD":return F+"/"+E+"/"+A;case"DD/MM/YYYY":return A+"/"+E+"/"+F;default:return E+"/"+A+"/"+F;}}else{return YAHOO.lang.isValue(C)?C:"";}}};YAHOO.register("datasource",YAHOO.util.DataSource,{version:"@VERSION@",build:"@BUILD@"});
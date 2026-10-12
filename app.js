// EPS INTERNATIONAL cloud app. Add your Firebase web config below.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig ="{
  "project_info": {
    "project_number": "88974674796",
    "project_id": "eps-international-e160b",
    "storage_bucket": "eps-international-e160b.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:88974674796:android:6c9243efc7e8776c5b4149",
        "android_client_info": {
          "package_name": "eps.managment.com"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": "AIzaSyB9XDiSu1d4Wtmj5z0IEaTzd8GtfPAKcfI"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
};
const authBox=document.querySelector("#auth"), appBox=document.querySelector("#app");
const authmsg=document.querySelector("#authmsg"), status=document.querySelector("#status");
const loginBtn=document.querySelector("#login"), signupBtn=document.querySelector("#signup");
let auth,db,currentType="sales",allRecords=[],user;
const labels={sales:"বিক্রয়",purchases:"ক্রয়",stock:"স্টক",expenses:"খরচ",employees:"কর্মচারী",deliveries:"ডেলিভারি"};
const money=n=>"৳ "+Number(n||0).toLocaleString("bn-BD",{maximumFractionDigits:2});
function configured(){return firebaseConfig.apiKey!=="PASTE_YOUR_API_KEY" && firebaseConfig.projectId!=="YOUR_PROJECT_ID"}
function showError(e){return e?.message||String(e)}
if(!configured()){status.textContent="Firebase config বসান";authmsg.textContent="ধাপগুলো README-BN.md ফাইলে দেওয়া আছে।"}
else {
 try{
  const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);
  status.textContent="ক্লাউড সংযোগ প্রস্তুত";
  loginBtn.onclick=async()=>{authmsg.textContent="";try{await signInWithEmailAndPassword(auth,email.value.trim(),password.value)}catch(e){authmsg.textContent=showError(e)}};
  signupBtn.onclick=async()=>{authmsg.textContent="";try{await createUserWithEmailAndPassword(auth,email.value.trim(),password.value)}catch(e){authmsg.textContent=showError(e)}};
  onAuthStateChanged(auth,async u=>{user=u;if(u){authBox.classList.add("hidden");appBox.classList.remove("hidden");document.querySelector("#logout").classList.remove("hidden");document.querySelector("#userbadge").textContent=u.email;status.textContent="ক্লাউডে সংযুক্ত";await load()}else{authBox.classList.remove("hidden");appBox.classList.add("hidden");document.querySelector("#logout").classList.add("hidden");status.textContent="লগইন প্রয়োজন"}});
  document.querySelector("#logout").onclick=()=>signOut(auth);
 }catch(e){status.textContent="সেটআপে সমস্যা";authmsg.textContent=showError(e)}
}
document.querySelector("#date").value=new Date().toISOString().slice(0,10);
document.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{currentType=b.dataset.type;document.querySelectorAll("#tabs button").forEach(x=>x.classList.toggle("active",x===b));document.querySelector("#sectionTitle").textContent=labels[currentType]+" রেকর্ড";document.querySelector("#name").placeholder=currentType==="employees"?"কর্মচারীর নাম":currentType==="deliveries"?"ডেলিভারির বিবরণ":"পণ্য বা বিবরণ";render()});
document.querySelector("#refresh").onclick=load;
document.querySelector("#entryForm").onsubmit=async e=>{e.preventDefault();if(!user||!db)return;const data={type:currentType,date:date.value,name:name.value.trim(),qty:Number(qty.value),amount:Number(amount.value),note:note.value.trim(),createdAt:serverTimestamp(),createdBy:user.uid};try{await addDoc(collection(db,"businessRecords"),data);e.target.reset();date.value=new Date().toISOString().slice(0,10);qty.value=1;amount.value=0;await load()}catch(err){alert("সংরক্ষণ করা যায়নি: "+showError(err))}};
async function load(){if(!user||!db)return;try{const snap=await getDocs(query(collection(db,"businessRecords"),orderBy("date","desc")));allRecords=snap.docs.map(d=>({id:d.id,...d.data()}));render()}catch(e){document.querySelector("#rows").innerHTML='<tr><td colspan="6">ডেটা লোড হয়নি। Firestore Rules এবং index/config পরীক্ষা করুন।</td></tr>';console.error(e)}}
function render(){const rows=allRecords.filter(r=>r.type===currentType);document.querySelector("#rows").innerHTML=rows.length?rows.map(r=>`<tr><td>${esc(r.date||"")}</td><td>${esc(r.name||"")}</td><td>${Number(r.qty||0).toLocaleString("bn-BD")}</td><td>${money(r.amount)}</td><td>${esc(r.note||"")}</td><td><button class="danger" data-del="${r.id}">মুছুন</button></td></tr>`).join(""):'<tr><td colspan="6">এখনো কোনো রেকর্ড নেই।</td></tr>';
document.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{if(confirm("এই রেকর্ডটি মুছে ফেলবেন?")){try{await deleteDoc(doc(db,"businessRecords",b.dataset.del));await load()}catch(e){alert(showError(e))}}});
document.querySelector("#salesTotal").textContent=money(allRecords.filter(r=>r.type==="sales").reduce((s,r)=>s+Number(r.amount||0),0));
document.querySelector("#purchaseTotal").textContent=money(allRecords.filter(r=>r.type==="purchases").reduce((s,r)=>s+Number(r.amount||0),0));
document.querySelector("#stockCount").textContent=allRecords.filter(r=>r.type==="stock").length.toLocaleString("bn-BD");
document.querySelector("#recordCount").textContent=allRecords.length.toLocaleString("bn-BD")}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

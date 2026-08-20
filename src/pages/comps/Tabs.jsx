import {useState} from 'react';

import GroupForm from "./GroupForm.jsx";
import PrivateChatForm from "./PrivateChatForm.jsx";

function Tabs() {
    const [activeTab, setActiveTab] = useState('tab1');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    }

    return (
        <div className = "flex flex-col h-screen w-screen">
            <div className="flex h-10 w-250 bg-white border-2 border-gray-300 rounded-lg overflow-hidden mx-auto mt-20">
                <div className={`flex-1 flex justify-center items-center cursor-pointer ${activeTab === 'tab1' ? 'bg-gray-300' : ''}`}
                    onClick={() => handleTabClick('tab1')}>
                    <span className="text-lg font-semibold">Create Group</span>
                </div>
                <div className={`flex-1 flex justify-center items-center cursor-pointer ${activeTab === 'tab2' ? 'bg-gray-300' : ''}`}
                    onClick={() => handleTabClick('tab2')}>
                    <span className="text-lg font-semibold">Create Private Chat</span>
                </div>
            </div>
            <div className="flex flex-1 flex-col mt-0 bg-gray-200 w-250 mx-auto">
                {activeTab == 'tab1' ? (
                    <GroupForm />
                ) : activeTab == 'tab2' ? (
                    <PrivateChatForm />
                ) : null}
            </div>
        </div>
        
    )
}

export default Tabs;
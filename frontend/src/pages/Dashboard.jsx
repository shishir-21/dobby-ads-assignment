import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder as FolderIcon, File as FileIcon, ChevronRight, Image as ImageIcon, Upload, Plus, LogOut, HardDrive } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'My Drive' }]);
  
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  
  const [folderSize, setFolderSize] = useState(null);
  
  const navigate = useNavigate();

  const fetchContents = async (folderId = null) => {
    try {
      const { data } = await api.get('/api/folders', { params: { parentId: folderId } });
      setFolders(data.folders);
      setFiles(data.files);
      
      if (folderId) {
        const sizeRes = await api.get(`/api/folders/${folderId}/size`);
        setFolderSize(sizeRes.data.size);
      } else {
        setFolderSize(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    fetchContents(currentFolder);
  }, [currentFolder, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const navigateToFolder = (folder) => {
    setCurrentFolder(folder._id);
    setBreadcrumbs([...breadcrumbs, { id: folder._id, name: folder.name }]);
  };

  const navigateToBreadcrumb = (index) => {
    const bc = breadcrumbs[index];
    setCurrentFolder(bc.id);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  const createFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await api.post('/api/folders', { name: newFolderName, parentId: currentFolder });
      setNewFolderName('');
      setIsFolderModalOpen(false);
      fetchContents(currentFolder);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append('image', uploadFile);
    if (currentFolder) {
      formData.append('folderId', currentFolder);
    }
    try {
      await api.post('/api/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadFile(null);
      setIsUploadModalOpen(false);
      fetchContents(currentFolder);
    } catch (error) {
      console.error(error);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand">
          <HardDrive size={24} />
          Dobby Drive
        </div>
        <button onClick={handleLogout} className="btn-outline flex items-center" style={{display: 'flex', gap: '0.5rem'}}>
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <main className="main-content">
        <div className="actions-bar">
          <div className="breadcrumbs">
            {breadcrumbs.map((bc, index) => (
              <React.Fragment key={bc.id || 'root'}>
                <span 
                  className="breadcrumb-item"
                  onClick={() => navigateToBreadcrumb(index)}
                >
                  {bc.name}
                </span>
                {index < breadcrumbs.length - 1 && <ChevronRight size={16} className="separator"/>}
              </React.Fragment>
            ))}
          </div>

          <div className="action-buttons">
            {currentFolder && folderSize !== null && (
               <span style={{ color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '1rem'}}>
                 Folder Size: {formatSize(folderSize)}
               </span>
            )}
            <button onClick={() => setIsFolderModalOpen(true)} className="btn-outline flex items-center" style={{display: 'flex', gap: '0.5rem', borderColor: 'var(--primary-color)', color: 'var(--primary-color)'}}>
              <Plus size={16} /> New Folder
            </button>
            <button onClick={() => setIsUploadModalOpen(true)} className="btn" style={{display: 'flex', gap: '0.5rem', width: 'auto'}}>
              <Upload size={16} /> Upload Image
            </button>
          </div>
        </div>

        {folders.length > 0 && (
          <div className="grid-section">
            <h3 className="section-title">Folders</h3>
            <div className="grid">
              {folders.map(folder => (
                <div key={folder._id} className="card" onClick={() => navigateToFolder(folder)}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                    <FolderIcon className="card-icon" />
                    <div className="card-title">{folder.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="grid-section">
            <h3 className="section-title">Images</h3>
            <div className="grid">
              {files.map(file => (
                <div key={file._id} className="card" style={{padding: '0.75rem'}}>
                  <img src={file.url} alt={file.name} className="file-image" loading="lazy" />
                  <div className="card-meta">
                    <span className="card-title" title={file.name} style={{fontSize: '0.9rem'}}>{file.name}</span>
                  </div>
                  <div className="card-meta">
                    <span>{formatSize(file.size)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {folders.length === 0 && files.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
            <ImageIcon size={48} style={{ opacity: 0.5, marginBottom: '1rem', display: 'inline-block' }} />
            <p>This folder is empty. Create a folder or upload an image.</p>
          </div>
        )}
      </main>

      {/* New Folder Modal */}
      {isFolderModalOpen && (
        <div className="modal-overlay" onClick={() => setIsFolderModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">New Folder</h3>
            <form onSubmit={createFolder}>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Folder name" 
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsFolderModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Upload Image</h3>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setUploadFile(e.target.files[0])}
                  required
                  style={{ background: 'transparent', padding: '0', border: 'none' }}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={!uploadFile}>Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

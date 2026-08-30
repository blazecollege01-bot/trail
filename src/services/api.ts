import { FullDatabase, PhotoItem, StoryChapter, SocialLink, ProofItem, HomepageSettings, AboutData, ContactSettings, SiteSettings, MediaItem } from '../types';
import { initialData } from '../data/initialData';

const API_BASE = '/api';

export const api = {
  // Get public content (published items only)
  async getPublicContent(): Promise<FullDatabase> {
    try {
      const res = await fetch(`${API_BASE}/content`);
      if (!res.ok) throw new Error('Failed to fetch public content');
      const data = await res.json();
      return {
        ...initialData,
        ...data
      };
    } catch (e) {
      console.warn('API fetch failed, utilizing cached initial data:', e);
      return initialData;
    }
  },

  async getFullData(): Promise<FullDatabase> {
    return this.getPublicContent();
  },

  // Admin: Get all content including drafts & media
  async getAllContent(token: string): Promise<FullDatabase> {
    const res = await fetch(`${API_BASE}/admin/all-content`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch all content');
    return res.json();
  },

  // Admin: Update Homepage
  async updateHomepage(token: string, data: Partial<HomepageSettings>): Promise<HomepageSettings> {
    const res = await fetch(`${API_BASE}/admin/homepage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update homepage');
    const result = await res.json();
    return result.homepage;
  },

  // Admin: Story CRUD
  async createStory(token: string, data: Partial<StoryChapter>): Promise<StoryChapter> {
    const res = await fetch(`${API_BASE}/admin/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create story chapter');
    const result = await res.json();
    return result.chapter;
  },

  async updateStory(token: string, id: string, data: Partial<StoryChapter>): Promise<StoryChapter> {
    const res = await fetch(`${API_BASE}/admin/stories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update story chapter');
    const result = await res.json();
    return result.chapter;
  },

  async deleteStory(token: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/stories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete story chapter');
  },

  // Admin: Photos CRUD
  async createPhoto(token: string, data: Partial<PhotoItem>): Promise<PhotoItem> {
    const res = await fetch(`${API_BASE}/admin/photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add photo');
    const result = await res.json();
    return result.photo;
  },

  async updatePhoto(token: string, id: string, data: Partial<PhotoItem>): Promise<PhotoItem> {
    const res = await fetch(`${API_BASE}/admin/photos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update photo');
    const result = await res.json();
    return result.photo;
  },

  async deletePhoto(token: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/photos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete photo');
  },

  // Admin: About
  async updateAbout(token: string, data: Partial<AboutData>): Promise<AboutData> {
    const res = await fetch(`${API_BASE}/admin/about`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update about section');
    const result = await res.json();
    return result.about;
  },

  // Admin: Social Links CRUD
  async createSocialLink(token: string, data: Partial<SocialLink>): Promise<SocialLink> {
    const res = await fetch(`${API_BASE}/admin/social-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create social link');
    const result = await res.json();
    return result.link;
  },

  async createSocial(token: string, data: Partial<SocialLink>): Promise<SocialLink> {
    return this.createSocialLink(token, data);
  },

  async updateSocialLink(token: string, id: string, data: Partial<SocialLink>): Promise<SocialLink> {
    const res = await fetch(`${API_BASE}/admin/social-links/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update social link');
    const result = await res.json();
    return result.link;
  },

  async updateSocial(token: string, id: string, data: Partial<SocialLink>): Promise<SocialLink> {
    return this.updateSocialLink(token, id, data);
  },

  async deleteSocialLink(token: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/social-links/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete social link');
  },

  async deleteSocial(token: string, id: string): Promise<void> {
    return this.deleteSocialLink(token, id);
  },

  // Admin: Contact
  async updateContact(token: string, data: Partial<ContactSettings>): Promise<ContactSettings> {
    const res = await fetch(`${API_BASE}/admin/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update contact settings');
    const result = await res.json();
    return result.contact;
  },

  // Admin: Proofs CRUD
  async createProof(token: string, data: Partial<ProofItem>): Promise<ProofItem> {
    const res = await fetch(`${API_BASE}/admin/proofs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create proof');
    const result = await res.json();
    return result.proof;
  },

  async updateProof(token: string, id: string, data: Partial<ProofItem>): Promise<ProofItem> {
    const res = await fetch(`${API_BASE}/admin/proofs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update proof');
    const result = await res.json();
    return result.proof;
  },

  async deleteProof(token: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/proofs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete proof');
  },

  // Admin: Settings
  async updateSettings(token: string, data: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update site settings');
    const result = await res.json();
    return result.settings;
  },

  async changePassword(token: string, currentPass: string, newPass: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update password');
    }
  },

  // Admin: Media
  async getMedia(token: string): Promise<MediaItem[]> {
    const res = await fetch(`${API_BASE}/admin/media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch media');
    return res.json();
  },

  async deleteMedia(token: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete media item');
  },

  // Admin: Upload Image
  async uploadImage(token: string, file: File): Promise<{ url: string; media: MediaItem }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload image');
    }

    return res.json();
  },

  // Admin: Reset Data to Default
  async resetData(token: string): Promise<FullDatabase> {
    const res = await fetch(`${API_BASE}/admin/reset-data`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to reset database');
    const result = await res.json();
    return result.data;
  }
};

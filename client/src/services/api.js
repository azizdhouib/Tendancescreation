import { supabase } from '../lib/supabase';

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    let query = supabase
      .from('products')
      .select(`*, categories(id, name, slug)`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (params.category) {
      query = query.eq('category_id', params.category);
    }

    if (params.featured === 'true' || params.featured === true) {
      query = query.eq('is_featured', true);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    const products = data.map(p => ({
      ...p,
      _id: p.id,
      category: p.categories
    }));

    return { data: { products, pagination: { page: 1, pages: 1, total: products.length } } };
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories(id, name, slug)`)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: { ...data, _id: data.id, category: data.categories } };
  },

  getAllAdmin: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories(id, name, slug)`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data.map(p => ({ ...p, _id: p.id, category: p.categories })) };
  },

  create: async (formData) => {
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category_id: formData.get('category'),
      stock: parseInt(formData.get('stock')) || 0,
      is_featured: formData.get('isFeatured') === 'true',
      colors: JSON.parse(formData.get('colors') || '[]'),
      images: []
    };

    // Upload images
    const files = formData.getAll('images');
    for (const file of files) {
      if (file && file.size > 0) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          productData.images.push(urlData.publicUrl);
        }
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select(`*, categories(id, name, slug)`)
      .single();

    if (error) throw error;
    return { data: { ...data, _id: data.id, category: data.categories } };
  },

  update: async (id, formData) => {
    const existingImages = JSON.parse(formData.get('existingImages') || '[]');
    
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category_id: formData.get('category'),
      stock: parseInt(formData.get('stock')) || 0,
      is_featured: formData.get('isFeatured') === 'true',
      colors: JSON.parse(formData.get('colors') || '[]'),
      images: existingImages,
      updated_at: new Date().toISOString()
    };

    // Upload new images
    const files = formData.getAll('images');
    for (const file of files) {
      if (file && file.size > 0) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          productData.images.push(urlData.publicUrl);
        }
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select(`*, categories(id, name, slug)`)
      .single();

    if (error) throw error;
    return { data: { ...data, _id: data.id, category: data.categories } };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { data: { message: 'Produit supprimé' } };
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return { data: data.map(c => ({ ...c, _id: c.id })) };
  },

  getAllAdmin: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return { data: data.map(c => ({ ...c, _id: c.id })) };
  },

  create: async (formData) => {
    const categoryData = {
      name: formData.get('name'),
      description: formData.get('description') || ''
    };

    // Upload image if exists
    const file = formData.get('image');
    if (file && file.size > 0) {
      const fileName = `categories/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        categoryData.image = urlData.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) throw error;
    return { data: { ...data, _id: data.id } };
  },

  update: async (id, formData) => {
    const categoryData = {
      name: formData.get('name'),
      description: formData.get('description') || '',
      updated_at: new Date().toISOString()
    };

    const file = formData.get('image');
    if (file && file.size > 0) {
      const fileName = `categories/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        categoryData.image = urlData.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: { ...data, _id: data.id } };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { data: { message: 'Catégorie supprimée' } };
  }
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    const { items, customerInfo } = orderData;

    const order = {
      items: items.map(item => ({
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selected_color: item.selectedColor,
        image: item.image
      })),
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
      customer_city: customerInfo.city || '',
      customer_notes: customerInfo.notes || '',
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (error) throw error;

    // Update stock
    for (const item of items) {
      await supabase.rpc('decrement_stock', { 
        product_id: item.productId, 
        quantity: item.quantity 
      });
    }

    return { data: { ...data, orderNumber: data.order_number } };
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { 
      data: data.map(o => ({ 
        ...o, 
        _id: o.id, 
        orderNumber: o.order_number,
        customerInfo: {
          name: o.customer_name,
          email: o.customer_email,
          phone: o.customer_phone,
          address: o.customer_address,
          city: o.customer_city,
          notes: o.customer_notes
        }
      })) 
    };
  },

  updateStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data };
  }
};

// Settings API
export const settingsAPI = {
  get: async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) {
      return { 
        data: {
          primaryColor: '#9B4D96',
          secondaryColor: '#E85A8B',
          buttonColor: '#D4548A',
          backgroundColor: '#FDF5F8',
          accentColor: '#F5A623',
          siteName: 'Tendance&Creations',
          slogan: 'Des bouquets personnalisés pour des cadeaux uniques'
        }
      };
    }

    return { 
      data: {
        primaryColor: data.primary_color,
        secondaryColor: data.secondary_color,
        buttonColor: data.button_color,
        backgroundColor: data.background_color,
        accentColor: data.accent_color,
        siteName: data.site_name,
        slogan: data.slogan
      }
    };
  },

  update: async (settings) => {
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .single();

    const settingsData = {
      primary_color: settings.primaryColor,
      secondary_color: settings.secondaryColor,
      button_color: settings.buttonColor,
      background_color: settings.backgroundColor,
      accent_color: settings.accentColor,
      site_name: settings.siteName,
      slogan: settings.slogan,
      updated_at: new Date().toISOString()
    };

    let result;
    if (existing) {
      result = await supabase
        .from('site_settings')
        .update(settingsData)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('site_settings')
        .insert(settingsData)
        .select()
        .single();
    }

    if (result.error) throw result.error;
    return settingsAPI.get();
  }
};

// Auth API
export const authAPI = {
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { 
      data: { 
        _id: data.user.id,
        email: data.user.email,
        name: data.user.email.split('@')[0],
        role: 'admin',
        token: data.session.access_token
      }
    };
  },

  register: async ({ email, password, name }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) throw error;
    return { data };
  },

  getMe: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) throw new Error('Non authentifié');
    
    return { 
      data: {
        _id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email.split('@')[0],
        role: 'admin'
      }
    };
  },

  logout: async () => {
    await supabase.auth.signOut();
  }
};

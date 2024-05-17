import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

// Styled component for table
const Table = styled.table(() => ({
  // Table styling
}));

// Column fields for user data
const columnFields = [
  { value: 'id', label: 'Id' },
  { value: 'name', label: 'Name', enableSearch: true },
  { value: 'email', label: 'Email', enableSearch: true },
  { value: 'username', label: 'Username' },
  { value: 'phone', label: 'Phone' },
  { value: 'website', label: 'Website' },
];

// Custom hook for fetching and managing user data
export const useUserData = () => {
  // State hooks for users, filtered users, search inputs, and sorting
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [sortColumn, setSortColumn] = useState(columnFields[0].value);
  const [sortDirection, setSortDirection] = useState('asc');

  // Effect hook to fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get('/api/v1/users');
      setUsers(data);
      setFilteredUsers(data);
    };
    fetchUsers();
  }, []);

  // Effect hook for filtering and sorting users
  useEffect(() => {
    let filteredUsers = users.filter(
      user =>
        user.name.toLowerCase().includes(searchName.toLowerCase()) &&
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );

    if (sortColumn) {
      filteredUsers.sort((a, b) => {
        const x = a[sortColumn];
        const y = b[sortColumn];
        return sortDirection === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
      });
    }

    setFilteredUsers(filteredUsers);
  }, [users, searchName, searchEmail, sortColumn, sortDirection]);

  // Function to handle search inputs
  const handleOnSearch = event => {
    const { name, value } = event.target;
    if (name === 'name') {
      setSearchName(value);
    } else if (name === 'email') {
      setSearchEmail(value);
    } else {
      throw new Error('Unknown search element');
    }
  };

  // Function to handle sorting
  const handleSort = column => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Return necessary data and functions as object
  return {
    users: filteredUsers,
    columnFields,
    handleOnSearch,
    handleSort,
    sortColumn,
    sortDirection,
  };
};

// Functional component for UserList
const UserList = () => {
  // Destructuring necessary data and functions from useUserData hook
  const {
    users,
    columnFields,
    handleOnSearch,
    handleSort,
    sortColumn,
    sortDirection,
  } = useUserData();

  // Render component
  return (
    <div>
      <Table>
        <thead>
          <tr>
            {columnFields.map(field => {
              return (
                <th key={field.value}>
                  <div
                    onClick={() => handleSort(field.value)}
                    style={{ paddingBottom: 8 }}
                  >
                    {field.label}
                    {sortColumn === field.value &&
                      (sortDirection === 'asc' ? (
                        <span className={'sort-icon'}>▲</span>
                      ) : (
                        <span className={'sort-icon'}>▼</span>
                      ))}
                  </div>

                  {field.enableSearch ? (
                    <input
                      type={'text'}
                      placeholder={`Search by ${field.label}`}
                      name={field.value}
                      onChange={handleOnSearch}
                      style={{ padding: 6, width: 200 }}
                    />
                  ) : null}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              {columnFields.map(field => (
                <td key={field.value}>{user[field.value]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;



// 6th Task Done ✅✅✅

// Convert UserList React class component to functional component and convert witUserData HOC (Higher order Component) to a custom React hooks
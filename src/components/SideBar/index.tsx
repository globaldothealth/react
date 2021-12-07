import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    FlagIcon,
    LatestGlobal,
    LocationList,
    LocationListItem,
    SearchBar,
    SideBarHeader,
    StyledSideBar,
} from './styled';
import { selectCountriesData } from 'redux/App/selectors';
import { useAppSelector } from 'redux/hooks';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import VariantsContent from './VariantsContent';

const SideBar = () => {
    const location = useLocation();

    const [openSidebar, setOpenSidebar] = useState(true);
    const [isVariantsView, setIsVariantsView] = useState(false);

    // Sidebar has other content in VariantsView
    useEffect(() => {
        setIsVariantsView(location.pathname === '/variant-reporting');
    }, [location]);

    const handleOnClick = () => {
        setOpenSidebar((value) => !value);
    };

    const countriesData = useAppSelector(selectCountriesData)
        .filter((item) => item._id != null && item.code !== 'ZZ')
        .sort((a, b) => (a.casecount < b.casecount ? 1 : -1));

    const handleOnCountryClick = (row: React.MouseEvent<HTMLElement>) => {
        console.log(row);
    };

    console.log(countriesData);

    const Countries = () => (
        <>
            {countriesData.map((row) => {
                const { code, _id, casecount } = row;

                return (
                    <LocationListItem key={code} $barWidth={row.jhu}>
                        <button
                            country={code}
                            onClick={(row) => handleOnCountryClick(row)}
                        >
                            <span className="label">{_id}</span>
                            <span className="num">
                                {casecount.toLocaleString()}
                            </span>
                        </button>
                        <div className="country-cases-bar"></div>
                    </LocationListItem>
                );
            })}
        </>
    );

    return (
        <StyledSideBar
            $sidebaropen={openSidebar}
            $isVariantsView={isVariantsView}
        >
            {!isVariantsView ? (
                <>
                    <SideBarHeader id="sidebar-header">
                        <h1 id="total" className="sidebar-title total">
                            COVID-19 LINE LIST CASES
                        </h1>
                        <br />
                        <div id="disease-selector"></div>
                    </SideBarHeader>
                    <LatestGlobal id="latest-global">
                        <span id="total-cases" className="active">
                            61,078,740
                        </span>
                        <span id="p1-cases">NaN</span>
                        <span id="b1351-cases">NaN</span>
                        <span className="reported-cases-label"> cases</span>
                        <div className="last-updated-date">
                            Updated:{' '}
                            <span id="last-updated-date">Thu Nov 25 2021</span>
                        </div>
                    </LatestGlobal>
                    <SearchBar className="searchbar">
                        <Autocomplete
                            id="country-select"
                            options={countriesData}
                            autoHighlight
                            getOptionLabel={(option) => option._id}
                            renderOption={(props, option) => (
                                <Box
                                    component="li"
                                    className="autocompleteBox"
                                    {...props}
                                >
                                    <FlagIcon
                                        loading="lazy"
                                        width="20"
                                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                        alt=""
                                    />
                                    {option._id} ({option.code})
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Choose a country"
                                    inputProps={{
                                        ...params.inputProps,
                                    }}
                                />
                            )}
                        />
                    </SearchBar>
                    <LocationList>
                        <Countries />
                    </LocationList>
                </>
            ) : (
                <VariantsContent />
            )}
            <div id="sidebar-tab" onClick={handleOnClick}>
                <span id="sidebar-tab-icon">{openSidebar ? '◀' : '▶'}</span>
            </div>
        </StyledSideBar>
    );
};

export default SideBar;

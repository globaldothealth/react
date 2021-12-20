import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { StyledMapGuideDialog, StyledMapGuideButton } from './styled';

export default function MapGuide() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = useRef<HTMLElement>(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <StyledMapGuideButton>
            <Button onClick={handleClickOpen()}>
                <svg
                    className="MuiSvgIcon-root"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
                </svg>
                Map guide
            </Button>
            <StyledMapGuideDialog
                open={open}
                onClose={handleClose}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <div>
                            <h1>Welcome to Global.health Map!</h1>{' '}
                            <p>
                                These geospatial data visualisations allow you
                                to explore our COVID-19 line-list dataset
                                through a few different views:
                            </p>{' '}
                            <p>
                                <strong>Country View:</strong> Click on a
                                country to see available line-list data in that
                                country, and click “Explore Country Data” to
                                view and download corresponding filtered results
                                of data for that country. You can also use the
                                left-hand navigation to search or select a
                                country. Darker colours indicate more available
                                line-list data. Please see our{' '}
                                <a
                                    href="https://global.health/faqs/"
                                    title="FAQs"
                                >
                                    FAQs
                                </a>
                                and
                                <a
                                    href="https://global.health/acknowledgement/"
                                    title="Data Acknowledgments"
                                >
                                    Data Acknowledgments
                                </a>
                                for more info.)
                            </p>
                            <p>
                                <strong>Regional View:</strong> Click on a
                                circle to see available line-list data in that
                                region, and click “Explore Regional Data” to
                                view and download corresponding filtered results
                                of data for that region. Larger, darker circles
                                indicate more available line-list data. Records
                                that do not include regional metadata are
                                labeled as “Country, Country” (e.g. “India,
                                India”). Please see our{' '}
                                <a
                                    href="https://global.health/faqs/"
                                    title="FAQs"
                                >
                                    FAQs
                                </a>
                                for more info.
                            </p>
                            <p>
                                <strong>Coverage Map:</strong> This view
                                illustrates available line-list COVID-19 case
                                data in the Global.health database in a given
                                country as a percentage of total cumulative case
                                data as indicated by the
                                <a
                                    href="https://coronavirus.jhu.edu/map.html"
                                    title="Johns Hopkins University COVID Resource Center"
                                    target="blank"
                                    rel="noopener noreferrer"
                                >
                                    Johns Hopkins University COVID Resource
                                    Center
                                </a>
                                . Darker colours indicate more available
                                line-list data. Totals are updated daily. The
                                availability of publically-reported line-list
                                data varies substantially by country. Please see
                                our
                                <a
                                    href="https://global.health/faqs/"
                                    title="FAQs"
                                >
                                    FAQs
                                </a>
                                for more info.
                            </p>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </StyledMapGuideDialog>
        </StyledMapGuideButton>
    );
}
